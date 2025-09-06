import type { IProduct } from "../types";

const ProductCard = ({id, image_url, title}: IProduct) => {
  return (
    <div
      key={id}
      className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition"
    >
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-1">{title}</h2>
      </div>
    </div>
  )
}

export default ProductCard