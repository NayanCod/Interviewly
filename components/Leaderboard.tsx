import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Leaderboard = ({
  currUser,
  userScores,
}: {
  currUser: User;
  userScores: Leaderboards[];
}) => {
  if (!currUser) return null;
  
  return (
    <div>
      <h2 className="text-primary-200 text-3xl text-center mb-10">
        LeaderBoard
      </h2>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] md:text-2xl md:font-medium">
              S.no
            </TableHead>
            <TableHead className="md:text-2xl md:font-medium">Name</TableHead>
            <TableHead className="md:text-2xl md:font-medium">
              Interviews
            </TableHead>
            <TableHead className="md:text-2xl md:font-medium">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userScores.map((user, index) => (
            <TableRow
              key={user.id}
              className={`${
                currUser.id === user.id
                  ? "bg-primary-100 text-black hover:bg-primary-100"
                  : ""
              } ${
                index === 0
                  ? "bg-yellow-300 text-black hover:bg-yellow-300 hover:text-black"
                  : ""
              } rounded-full`}
            >
              <TableCell className="md:font-medium md:text-xl">
                {index + 1}
              </TableCell>
              <TableCell className="md:font-medium md:text-xl md:flex md:flex-row items-center gap-2 hidden">
                <Avatar>
                  <AvatarImage src={user?.photoUrl}/>
                  <AvatarFallback className="bg-blue-950 text-primary-100">
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>{user.name}
              </TableCell>
              <TableCell className="md:font-medium md:text-xl md:hidden block">
                {user.name}
              </TableCell>
              <TableCell className="md:font-medium md:text-xl">
                {user.totalInterviews}
              </TableCell>
              <TableCell className="md:font-medium md:text-xl flex flex-row gap-1 items-center justify-between">
                {user.totalImpressions}
                {index === 0 && <Medal color="#000000" size={25} />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Leaderboard;
