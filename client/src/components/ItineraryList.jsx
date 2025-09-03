import PlaceCard from "./PlaceCard";

export default function ItineraryList({ items, onPick, onRemove, onClear }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">여행 일정</h3>
        <button
          onClick={onClear}
          disabled={items.length === 0}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          전체 비우기
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">
          일정이 비어 있어요. 검색 결과에서 <b>“➕ 일정”</b>을 눌러 추가하세요.
        </p>
      ) : (
        <div className="grid gap-3">
          {items.map((p, idx) => (
            <PlaceCard
              key={p.id}
              title={`${idx + 1}. ${p.name}`}
              description={p.address}
              onClick={() => onPick(p)}
              onRemove={() => onRemove(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
