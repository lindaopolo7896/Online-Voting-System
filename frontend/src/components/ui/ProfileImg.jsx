import useAuth from "../../hooks/useAuth";
export default function ProfileImg({ className }) {
  const { user } = useAuth();
  console.log(user);
  return (
    <img
      src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.name}`}
      alt={user?.name}
      className={`w-10 h-10 rounded-full ${className}`}
    />
  );
}
