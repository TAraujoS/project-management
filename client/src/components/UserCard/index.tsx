import { User } from "@/types";
import Image from "next/image";
import React from "react";

type UserCardProps = {
  user: User;
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="mb-3 flex items-center space-x-1 rounded border bg-white p-4 shadow dark:bg-dark-secondary dark:text-white">
      {user.profilePictureUrl && (
        <Image
          src={`https://pm-s3-th-images.s3.us-east-1.amazonaws.com/${user.profilePictureUrl}`}
          width={32}
          height={32}
          alt={`${user.username}`}
          className="rounded-full"
        />
      )}
      <div>
        <h3>Nome: {user.username}</h3>
        <p>Email: {user.email ?? "-"}</p>
      </div>
    </div>
  );
};

export default UserCard;
