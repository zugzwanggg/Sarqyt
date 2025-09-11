import { useEffect, useState } from "react";
import { Plus, Upload } from "lucide-react";
import ProductCard from "../components/ProductCard";
import type { IProduct } from "../types";
import { useUser } from "../context/UserContext";
import { getSellerProducts } from "../api/seller";

export default function ProductsPage() {
  const { user } = useUser();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const data = await getSellerProducts(user?.shop_id);
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !imageFile) return;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", imageFile);
      formData.append("shop_id", String(user?.shop_id));

      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setImageFile(null);
      setPreviewUrl(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Shop Products
          </h1>
          <p className="text-sm text-gray-500">
            Manage and organize your shop’s products
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-primaryColor text-white shadow-lg hover:opacity-90 transition text-sm sm:text-base"
        >
          <Plus size={18} />
          <span className="hidden xs:inline">Add Product</span>
        </button>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-24">
          <img
            src="/empty-box.svg"
            alt="No products"
            className="w-48 h-48 mb-6 opacity-70"
          />
          <h2 className="text-lg font-semibold">No products yet</h2>
          <p className="text-sm">
            Start by adding your first product to showcase here.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-primaryColor text-white shadow-md hover:opacity-90 transition"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />

              {/* Modern file upload */}
              <div>
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-primaryColor transition"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-600 text-sm">
                    Drop file here or{" "}
                    <span className="text-primaryColor">browse</span>
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Preview */}
                {previewUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primaryColor text-white py-2 rounded-lg shadow hover:opacity-90 transition"
              >
                Create Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}