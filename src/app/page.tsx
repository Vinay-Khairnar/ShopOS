import { redirect } from "next/navigation";

export default function Home() {
  // Directly redirect visitors to the protected dashboard 
  // (the middleware will handle bouncing them to /login if they aren't authenticated)
  redirect("/dashboard");
}
