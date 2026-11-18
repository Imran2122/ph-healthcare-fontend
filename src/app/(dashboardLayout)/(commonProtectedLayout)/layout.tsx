export default function CommonProtectedLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <h2>CommonDashboardLayout</h2>
      {children}
    </>
  );
}
