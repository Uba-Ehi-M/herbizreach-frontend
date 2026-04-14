import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProductsService } from "@/services/products.service";
import type { UpdateProductDto } from "@/types/product.types";

export const PRODUCTS_KEY = ["products"] as const;

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: ProductsService.getAll,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, id],
    queryFn: () => ProductsService.getOne(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => ProductsService.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
      toast.success("Product added successfully!");
    },
    onError: () => toast.error("Failed to add product. Please try again."),
  });
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProductDto) => ProductsService.update(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
      void qc.invalidateQueries({ queryKey: [...PRODUCTS_KEY, id] });
      toast.success("Product updated.");
    },
    onError: () => toast.error("Update failed."),
  });
}

export function useUpdateProductImage(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => ProductsService.updateImage(id, form),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
      void qc.invalidateQueries({ queryKey: [...PRODUCTS_KEY, id] });
      toast.success("Image updated.");
    },
    onError: () => toast.error("Image upload failed."),
  });
}

export function useAppendProductImages(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => ProductsService.appendImages(id, form),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
      void qc.invalidateQueries({ queryKey: [...PRODUCTS_KEY, id] });
      toast.success("Photos added.");
    },
    onError: () => toast.error("Could not add photos."),
  });
}

export function useDuplicateProduct(options?: { navigateToEdit?: boolean }) {
  const navigateToEdit = options?.navigateToEdit ?? true;
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (id: string) => ProductsService.duplicate(id),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
      toast.success("Draft copy created — review and publish when ready.");
      if (navigateToEdit) {
        router.push(`/products/${data.id}`);
      }
    },
    onError: () => toast.error("Could not duplicate product."),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ProductsService.delete,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
      toast.success("Product deleted.");
    },
    onError: () => toast.error("Could not delete product."),
  });
}
