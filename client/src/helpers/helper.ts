export function timeAgo(dateString: string): string {
  const now = new Date();
  const pastDate = new Date(dateString);
  const timeDiff = now.getTime() - pastDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) return "Today";
  if (daysDiff === 1) return "1 day ago";
  return `${daysDiff} days ago`;
}

export const getOtherUser = (userId: string | undefined, members: string[]) => {
  if (userId && members) {
    const index = members?.indexOf(userId) ^ 1;
    return members[index];
  }
  return undefined;
};

export const getOrSaveFromLocal = ({
  key,
  value,
  get,
}: {
  key: string;
  value: any;
  get: boolean;
}) => {
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key) ?? "")
      : null;
  else localStorage.setItem(key, JSON.stringify(value));
};

export function generateAuthHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}
