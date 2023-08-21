export const fetchPosts = async (pageParam: number = 1, limit: number = 5) => {
    const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/posts?limit=${limit}&page=${pageParam}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoRGF0YSI6eyJ1c2VySWQiOiI2NGUxMjE1YzhlNTVkZjc5ZDFiZTVkMzcifSwiZXhwaXJlcyI6IjdkIiwiaWF0IjoxNjkyNDc1NzkyLCJleHAiOjE2OTMwODA1OTJ9.XDRHUGYwfaKLnH9PGBRCsphU0zU9KyWxUTyFsic68EU`
        }
    });

    const data = await res.json();
    return data;
}

export const maybeLikePost = async (postId: string) => {
    const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/posts/${postId}/like`, {
        method: "put",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoRGF0YSI6eyJ1c2VySWQiOiI2NGUxMjE1YzhlNTVkZjc5ZDFiZTVkMzcifSwiZXhwaXJlcyI6IjdkIiwiaWF0IjoxNjkyNDc1NzkyLCJleHAiOjE2OTMwODA1OTJ9.XDRHUGYwfaKLnH9PGBRCsphU0zU9KyWxUTyFsic68EU`
        }
    });

    const data = await res.json();
    if (res.status !== 200) return false;
    return data;
}