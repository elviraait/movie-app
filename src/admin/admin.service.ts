import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalMovies,
      totalUsers,
      totalReviews,
      moviesByGenre,
      reviewsThisMonth,
      reviewsLastMonth,
      usersThisMonth,
      moviesThisMonth,
      recentMovies,
      recentUsers,
      topRatedMovies,
      avgRatingResult,
    ] = await Promise.all([
      this.prisma.movie.count(),
      this.prisma.user.count(),
      this.prisma.review.count(),
      this.prisma.movie.groupBy({ by: ['genre'], _count: { genre: true } }),
      this.prisma.review.count({ where: { createdAt: { gte: startOfMonth } } }),
      this.prisma.review.count({
        where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
      }),
      this.prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      this.prisma.movie.count({ where: { createdAt: { gte: startOfMonth } } }),
      this.prisma.movie.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { reviews: true } } },
      }),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      this.prisma.movie.findMany({
        take: 10,
        include: {
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true } },
        },
        where: { reviews: { some: {} } },
      }),
      this.prisma.review.aggregate({ _avg: { rating: true } }),
    ]);

    const topRated = topRatedMovies
      .map((m) => ({
        id: m.id,
        title: m.title,
        genre: m.genre,
        year: m.year,
        posterUrl: (m as any).posterUrl,
        reviewCount: m._count.reviews,
        avgRating:
          m.reviews.length > 0
            ? Math.round(
                (m.reviews.reduce((s, r) => s + r.rating, 0) /
                  m.reviews.length) *
                  10,
              ) / 10
            : 0,
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 5);

    return {
      overview: {
        totalMovies,
        totalUsers,
        totalReviews,
        avgRating: Math.round((avgRatingResult._avg.rating || 0) * 10) / 10,
        reviewsThisMonth,
        reviewsLastMonth,
        reviewsGrowth:
          reviewsLastMonth > 0
            ? Math.round(
                ((reviewsThisMonth - reviewsLastMonth) / reviewsLastMonth) *
                  100,
              )
            : reviewsThisMonth > 0
              ? 100
              : 0,
        newUsersThisMonth: usersThisMonth,
        newMoviesThisMonth: moviesThisMonth,
      },
      moviesByGenre: moviesByGenre.map((g) => ({
        genre: g.genre,
        count: g._count.genre,
      })),
      recentMovies,
      recentUsers,
      topRatedMovies: topRated,
    };
  }
}
