import { getAllEvents } from "@/entities/event/api";
import { HomePage } from "@/view";

export default async function Home(){
  const events = await getAllEvents()
  return <HomePage events={events}/>
}