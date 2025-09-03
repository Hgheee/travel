import PlaceCard from "./PlaceCard";

export default function PlaceList({
  places,
  onPick,
  onBookmark,
  bookmarks,
  onAddToPlan,
}) {
  const bookmarked = new Set(bookmarks.map((b) => b.id));

  return (
    <div className="grid gap-4">
      {places.map((p) => (
        <PlaceCard
          key={p.id}
          title={p.name}
          description={p.address}
          onClick={() => onPick(p)}
          onBookmark={() => onBookmark(p)}
          bookmarked={bookmarked.has(p.id)}
          onAddToPlan={() => onAddToPlan(p)}
        />
      ))}
    </div>
  );
}
