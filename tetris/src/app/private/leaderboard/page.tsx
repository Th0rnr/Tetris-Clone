import { highScoreController } from "@/app/controllers/highScoreController";

export default async function Leaderboard() {
  const highScores = await highScoreController.getTopScores(10);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900 flex flex-col items-center py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">
        <span className="flex space-x-1">
          <span className="text-blue-500">H</span>
          <span className="text-yellow-400">I</span>
          <span className="text-green-500">G</span>
          <span className="text-red-500">H</span>
          <span className="mx-2 text-white">-</span>
          <span className="text-purple-500">S</span>
          <span className="text-blue-500">C</span>
          <span className="text-yellow-400">O</span>
          <span className="text-green-500">R</span>
          <span className="text-red-500">E</span>
          <span className="text-purple-500">S</span>
        </span>
      </h1>

      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
          <div className="grid grid-cols-12 text-sm font-semibold text-gray-300">
            <div className="col-span-2 text-center">#</div>
            <div className="col-span-6">Player</div>
            <div className="col-span-4 text-right">Score</div>
          </div>
        </div>

        <div className="divide-y divide-gray-700">
          {highScores.map((score, index) => (
            <div
              key={score.id}
              className="px-6 py-4 hover:bg-gray-700/50 transition-colors"
            >
              <div className="grid grid-cols-12 items-center">
                <div className="col-span-2 text-center">
                  <span
                    className={`
                    text-lg font-bold
                    ${index === 0 ? "text-yellow-400" : ""}
                    ${index === 1 ? "text-gray-300" : ""}
                    ${index === 2 ? "text-orange-400" : ""}
                    ${index > 2 ? "text-gray-500" : ""}
                  `}
                  >
                    {index + 1}
                  </span>
                </div>

                <div className="col-span-6">
                  <span className="text-white font-medium">
                    {score.user.username}
                  </span>
                </div>

                <div className="col-span-4 text-right">
                  <span className="font-mono text-lg font-semibold text-blue-400">
                    {score.score.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {highScores.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <p>No high scores yet!</p>
          <p className="text-sm mt-2">Be the first to set a record!</p>
        </div>
      )}
    </div>
  );
}
