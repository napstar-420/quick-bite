export default function PendingApproval() {
  return (
    <main className="min-h-screen grid place-items-center bg-neutral">
      <div className="text-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-secondary-foreground">Application under review</h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">It can take us 24 to 48 business hours to review your application. Please check again later</p>
      </div>
    </main>
  )
}