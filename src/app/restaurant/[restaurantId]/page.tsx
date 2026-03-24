export default async function RestaurantIdPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;

  return <div>Restaurant Details: {restaurantId}</div>;
}