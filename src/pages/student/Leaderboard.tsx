import { motion } from "framer-motion";
import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Flame, Target, Crown } from "lucide-react";
import { leaderboardData, studentProfile } from "@/data/studentMockData";

const Leaderboard = () => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-bold">#{rank}</span>;
    }
  };

  const getRankBackground = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return "bg-primary/10 border-primary";
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-gray-300/10 to-gray-400/10 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/10 to-orange-500/10 border-amber-600/30";
      default:
        return "bg-card border-border";
    }
  };

  const currentUserRank = leaderboardData.findIndex(s => s.isCurrentUser) + 1;
  const currentUser = leaderboardData.find(s => s.isCurrentUser);

  return (
    <StudentNav>
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
              <p className="text-sm text-muted-foreground">{studentProfile.class} Rankings</p>
            </div>
          </div>
        </motion.div>

        {/* Your Position Card */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                      {currentUser.avatar}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Your Position</p>
                      <p className="text-2xl font-bold text-foreground">Rank #{currentUserRank}</p>
                      <p className="text-sm text-primary font-medium">{currentUser.xpPoints.toLocaleString()} XP</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-orange-500 mb-1">
                      <Flame className="w-4 h-4" />
                      <span className="font-bold">{currentUser.streak} days</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">{currentUser.tasksCompleted} tasks</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-end justify-center gap-2 mb-4">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg font-bold mb-2 border-2 border-gray-400">
                {leaderboardData[1]?.avatar}
              </div>
              <p className="text-xs font-medium text-center truncate w-20">{leaderboardData[1]?.name.split(' ')[0]}</p>
              <p className="text-xs text-muted-foreground">{leaderboardData[1]?.xpPoints.toLocaleString()} XP</p>
              <div className="w-20 h-16 bg-gray-200 dark:bg-gray-700 rounded-t-lg mt-2 flex items-center justify-center">
                <Medal className="w-6 h-6 text-gray-500" />
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mb-4">
              <Crown className="w-8 h-8 text-yellow-500 mb-1" />
              <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-xl font-bold mb-2 border-2 border-yellow-500">
                {leaderboardData[0]?.avatar}
              </div>
              <p className="text-sm font-bold text-center truncate w-24">{leaderboardData[0]?.name.split(' ')[0]}</p>
              <p className="text-xs text-primary font-medium">{leaderboardData[0]?.xpPoints.toLocaleString()} XP</p>
              <div className="w-24 h-24 bg-yellow-200 dark:bg-yellow-800/30 rounded-t-lg mt-2 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-lg font-bold mb-2 border-2 border-amber-600">
                {leaderboardData[2]?.avatar}
              </div>
              <p className="text-xs font-medium text-center truncate w-20">{leaderboardData[2]?.name.split(' ')[0]}</p>
              <p className="text-xs text-muted-foreground">{leaderboardData[2]?.xpPoints.toLocaleString()} XP</p>
              <div className="w-20 h-12 bg-amber-200 dark:bg-amber-800/30 rounded-t-lg mt-2 flex items-center justify-center">
                <Medal className="w-5 h-5 text-amber-700" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">All Rankings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {leaderboardData.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`flex items-center justify-between p-4 ${getRankBackground(index + 1, student.isCurrentUser || false)} ${student.isCurrentUser ? 'border-l-4' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 flex items-center justify-center">
                        {getRankIcon(index + 1)}
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        student.isCurrentUser 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {student.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${student.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                            {student.name}
                            {student.isCurrentUser && <span className="text-xs ml-1">(You)</span>}
                          </p>
                          {student.badges.length > 0 && (
                            <div className="flex gap-0.5">
                              {student.badges.map((badge, i) => (
                                <span key={i} className="text-sm">{badge}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{student.xpPoints.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">XP Points</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Badge Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Badge Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span>🏆</span>
                  <span className="text-muted-foreground">Champion</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⭐</span>
                  <span className="text-muted-foreground">Star Performer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔥</span>
                  <span className="text-muted-foreground">Streak Master</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📚</span>
                  <span className="text-muted-foreground">Bookworm</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <span className="text-muted-foreground">Goal Achiever</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </StudentNav>
  );
};

export default Leaderboard;
