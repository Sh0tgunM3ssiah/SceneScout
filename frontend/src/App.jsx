import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import SearchPage from "./pages/search/SearchPage";
import PostPage from "./pages/post/PostPage";
import MessagesPage from "./pages/messages/MessagesPage";
import ScenePage from "./pages/scenes/ScenePage";
import ClassifiedAdPage from "./pages/scenes/ClassifiedAdPage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
	const { data: authUser, isLoading } = useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					}
				});
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	});

	if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

	return (
		<div className='flex max-w-6xl mx-auto'>
			{/* Common component, bc it's not wrapped with Routes */}
			{authUser && <Sidebar />}
			<Routes>
				<Route path='/' element={authUser ? <HomePage authUser={authUser} /> : <Navigate to='/login' />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/search' element={authUser ? <SearchPage authUser={authUser} /> : <Navigate to='/login' />} />
				<Route path='/scenes' element={authUser ? <ScenePage authUser={authUser} /> : <Navigate to='/login' />} />
				<Route path='/scenes/classifieds/:adId' element={authUser ? <ClassifiedAdPage authUser={authUser} /> : <Navigate to='/login' />} />
				<Route path='/messages' element={authUser ? <MessagesPage authUser={authUser} /> : <Navigate to='/login' />} />
				<Route path='/posts/:id' element={ <PostPage authUser={authUser} /> } />
				<Route path='/notifications' element={authUser ? <NotificationPage authUser={authUser} /> : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage authUser={authUser} /> : <Navigate to='/login' />} />
			</Routes>
			{authUser && <RightPanel />}
			<Toaster />
		</div>
	);
}

export default App;
