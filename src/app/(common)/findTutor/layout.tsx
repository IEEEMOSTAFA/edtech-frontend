import React from "react";

export default function FindTutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen">
        {/* <p>this is find</p> */}
      {children}
    </section>
  );
}
