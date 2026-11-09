<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use RuntimeException;
use Throwable;

class ProductController extends Controller
{
    public function index()
    {
        return ProductResource::collection(
            Product::with('category')->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,category_id'],
            'price' => ['required', 'numeric', 'min:0'],
            'img' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'stock' => ['required', 'integer', 'min:0'],
            'slug' => ['required', 'string', 'max:255', 'unique:products,slug'],
        ]);

        $imagePath = null;
        if ($request->hasFile('img')) {
            $imagePath = $this->storeImage($request->file('img'));
            $validated['img'] = $imagePath;
        }

        try {
            $product = Product::create($validated);
        } catch (Throwable $exception) {
            if ($imagePath !== null && ! $this->deleteStoredImage($imagePath)) {
                $this->logImageCleanupFailure($imagePath);
            }

            throw $exception;
        }

        return (new ProductResource($product->load('category')))
            ->additional(['message' => 'Produk berhasil ditambahkan.'])
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $id)
    {
        return new ProductResource(
            Product::with('category')->findOrFail($id)
        );
    }

    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);
        $oldImagePath = $product->img;

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'description' => ['sometimes', 'nullable', 'string'],
            'category_id' => ['sometimes', 'required', 'exists:categories,category_id'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'img' => ['sometimes', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'slug')->ignore($product->product_id, 'product_id'),
            ],
        ]);

        $newImagePath = null;
        if ($request->hasFile('img')) {
            $newImagePath = $this->storeImage($request->file('img'));
            $validated['img'] = $newImagePath;
        }

        try {
            $product->update($validated);
        } catch (Throwable $exception) {
            if ($newImagePath !== null && ! $this->deleteStoredImage($newImagePath)) {
                $this->logImageCleanupFailure($newImagePath);
            }

            throw $exception;
        }

        $cleanupFailed = $newImagePath !== null
            && $oldImagePath !== $newImagePath
            && ! $this->deleteImageIfUnused($oldImagePath);

        if ($cleanupFailed) {
            $this->logImageCleanupFailure($oldImagePath);
        }

        return (new ProductResource($product->load('category')))
            ->additional([
                'message' => $cleanupFailed
                    ? 'Produk berhasil diperbarui, tetapi foto lama gagal dihapus.'
                    : 'Produk berhasil diperbarui.',
            ]);
    }

    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $imagePath = $product->img;
        $product->delete();

        $cleanupFailed = ! $this->deleteImageIfUnused($imagePath);
        if ($cleanupFailed) {
            $this->logImageCleanupFailure($imagePath);
        }

        return response()->json([
            'message' => $cleanupFailed
                ? 'Produk berhasil dihapus, tetapi foto gagal dihapus dari penyimpanan.'
                : 'Produk berhasil dihapus.',
        ]);
    }

    private function storeImage(UploadedFile $image): string
    {
        $path = $image->store('products', 'public');

        if (! is_string($path) || $path === '') {
            throw new RuntimeException('Foto produk gagal disimpan ke public storage.');
        }

        return $path;
    }

    private function deleteStoredImage(?string $path): bool
    {
        if ($path === null || ! str_starts_with($path, 'products/')) {
            return true;
        }

        if (str_contains($path, '..') || str_contains($path, '\\')) {
            return false;
        }

        $disk = Storage::disk('public');

        return ! $disk->exists($path) || $disk->delete($path);
    }

    private function deleteImageIfUnused(?string $path): bool
    {
        if ($path === null || Product::where('img', $path)->exists()) {
            return true;
        }

        return $this->deleteStoredImage($path);
    }

    private function logImageCleanupFailure(string $path): void
    {
        Log::warning('Unable to remove a product image from public storage.', [
            'path' => $path,
        ]);
    }
}
