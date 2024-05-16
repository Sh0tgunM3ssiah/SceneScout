import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const FollowingList = ({ userId }) => {
	const { data: followingUsers, isLoading, error } = useQuery({
		queryKey: ["followingUsers", userId],
		queryFn: async () => {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/following/${userId}`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Failed to fetch following users");
			}
			return data;
		},
		enabled: !!userId,
	});

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	if (followingUsers.length === 0) {
		return <p className="text-center my-4">It's looking like 👻 town in here</p>;
	}

	return (
		<div className="following-list">
			{followingUsers.map((user) => (
				<div key={user._id} className="flex items-center gap-4 p-4 border-b border-gray-700">
					<img src={user.profileImg || "/avatar-placeholder.png"} alt={user.username} className="w-10 h-10 rounded-full" />
					<div className="flex flex-col">
						<Link to={`/profile/${user.username}`} className="text-lg font-bold text-blue-500">
							{user.fullName}
						</Link>
						<span className="text-sm text-slate-500">@{user.username}</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default FollowingList;
