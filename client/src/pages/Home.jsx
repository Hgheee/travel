import PlaceCard from "../components/PlaceCard";

export default function Home() {
  const places = [
    {
      image: "https://source.unsplash.com/400x300/?beach",
      title: "해변 여행",
      description: "푸른 바다와 하얀 모래사장에서 여유로운 휴식을 즐겨보세요.",
    },
    {
      image: "https://source.unsplash.com/400x300/?mountain",
      title: "산속 힐링",
      description: "청정한 공기와 숲길을 걸으며 마음의 평화를 찾아보세요.",
    },
    {
      image: "https://source.unsplash.com/400x300/?city",
      title: "도시 탐험",
      description: "현대적인 건축물과 활기찬 문화가 살아 숨 쉬는 도시 여행.",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero 섹션 */}
      <div className="text-center py-16 bg-violet-50 rounded-xl shadow-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold text-violet-700 mb-6">
          편안한 여행의 시작 ✈️
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          여행지 추천 사이트에 오신 것을 환영합니다.
          <br />
          당신만의 특별한 여행지를 지금 찾아보세요 🌸
        </p>
        <button className="bg-violet-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors">
          여행지 추천 받기
        </button>
      </div>

      {/* 추천 카드 섹션 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          추천 여행지 ✨
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {places.map((place, index) => (
            <PlaceCard
              key={index}
              image={place.image}
              title={place.title}
              description={place.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
