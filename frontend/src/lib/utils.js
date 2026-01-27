export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
export function createPageUrl(pageName) {
  switch (pageName) {
    case "Home":
      return "/";
    case "Cars":
      return "/cars";
    case "SellCar":
      return "/sellcar";
    case "CarDetails":
      return "/car-details";
    case "AboutUs":
      return "/about";
    default:
      return "/";
  }
}
