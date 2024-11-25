/*import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <>
      redirect('/login');
    </>
  );
}*/

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
