// app/vocabulary/page.tsx
import { auth } from "@clerk/nextjs/server";
import VocabularyModule from "./components/VocabularyModule"; // Make sure this is a client component

export default async function VocabularyPage() {
  const { userId } =await auth(); 

  return (
    <div>
      <VocabularyModule userId={userId ?? ""} />
    </div>
  );
}
