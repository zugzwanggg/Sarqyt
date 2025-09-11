import { useEffect, useState } from "react";
import { Plus, Upload, Trash2, X, Search } from "lucide-react";
import ProductCard from "../components/ProductCard";
import type { ICategory, IProduct } from "../types";
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

  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
  const [categories] = useState<ICategory[]>([
    { id: 1, name: "Meals" },
    { id: 2, name: "Bakeries" },
    { id: 3, name: "Vegeterian" },
    { id: 4, name: "Fast Food" },
    { id: 5, name: "Hotels" },
    { id: 6, name: "Groceries" },
  ]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

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
      formData.append(
        "categories",
        JSON.stringify(selectedCategories.map((c) => c.id))
      );

      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setImageFile(null);
      setPreviewUrl(null);
      setSelectedCategories([]);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const cancelImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const toggleCategory = (category: ICategory) => {
    if (selectedCategories.find((c) => c.id === category.id)) {
      setSelectedCategories(
        selectedCategories.filter((c) => c.id !== category.id)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const removeCategory = (category: ICategory) => {
    setSelectedCategories(
      selectedCategories.filter((c) => c.id !== category.id)
    );
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

      {/* Product Modal */}
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
              {/* Modern file upload */}
              <div>
                {!previewUrl ? (
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-primaryColor transition"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-gray-600 text-sm">
                      Drop file here or {" "}
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
                ) : (
                  <div className="text-right flex justify-end text-red-500 mb-1">
                    <Trash2 onClick={() => cancelImage()} />
                  </div>
                )}

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

              {/* Selected Categories */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedCategories.map((cat) => (
                    <span
                      key={cat.id}
                      className="flex items-center gap-1 px-3 py-1 bg-primaryColor/10 text-primaryColor text-sm font-medium rounded-full border border-primaryColor/30 shadow-sm"
                    >
                      {cat.name}
                      <button
                        type="button"
                        onClick={() => removeCategory(cat)}
                        className="hover:bg-primaryColor/20 rounded-full p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}

                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-primaryColor text-white text-sm shadow hover:opacity-90"
                  >
                    <Plus size={14} /> Add Category
                  </button>
                </div>
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

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X/>
            </button>
            <h2 className="text-lg font-semibold mb-4">Select Categories</h2>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mb-4">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>

            <div className="max-h-64 overflow-y-auto grid grid-cols-1 gap-2">
              {categories
                .filter((c) =>
                  c.name.toLowerCase().includes(categorySearch.toLowerCase())
                )
                .map((cat) => {
                  const isSelected = selectedCategories.find(
                    (c) => c.id === cat.id
                  );
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition shadow-sm text-left 
                        ${isSelected
                          ? "bg-primaryColor text-white border-primaryColor"
                          : "bg-white text-gray-700 border-gray-200 hover:border-primaryColor hover:text-primaryColor"}`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}