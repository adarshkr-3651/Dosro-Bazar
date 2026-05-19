import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllItems, getProductBySlug, getSimilarItems, getRecommendations } from '../lib/api';

export const useItems = (page?: number, limit?: number, author?: string) => {
  return useQuery({
    queryKey: ['items', { page, limit, author }],
    queryFn: () => getAllItems(page, limit, author),
  });
};

export const useItemDetail = (slug: string) => {
  return useQuery({
    queryKey: ['item', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
};

export const useSimilarItems = (slug: string) => {
  return useQuery({
    queryKey: ['items', 'similar', slug],
    queryFn: () => getSimilarItems(slug),
    enabled: !!slug,
  });
};

export const useRecommendations = () => {
  return useQuery({
    queryKey: ['items', 'recommendations'],
    queryFn: () => getRecommendations(),
  });
};
