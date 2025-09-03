export default function PlaceCard({
  image,
  title,
  description,
  onClick, // 카드 클릭
  onBookmark, // 북마크 버튼
  bookmarked, // 북마크 상태
  onAddToPlan, // 일정 추가 버튼
  onRemove, // 일정에서 제거 버튼
}) {
  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {image && (
        <img src={image} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-violet-700 mb-1">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm mb-2">{description}</p>
        )}

        <div className="flex gap-2">
          {onAddToPlan && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToPlan();
              }}
              className="px-2 py-1 text-sm rounded bg-violet-100 hover:bg-violet-200"
            >
              ➕ 일정
            </button>
          )}
          {onBookmark && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark();
              }}
              className="px-2 py-1 text-sm rounded bg-yellow-100 hover:bg-yellow-200"
            >
              {bookmarked ? "★" : "☆"}
            </button>
          )}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="px-2 py-1 text-sm rounded bg-red-100 hover:bg-red-200"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
