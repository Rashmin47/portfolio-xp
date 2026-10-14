if (process.env.SHOW_DUMMY === "1" && process.env.VERCEL_ENV === "production") {
  throw new Error(
    "SHOW_DUMMY cannot be set to 1 in production environment (VERCEL_ENV=production)"
  );
}

export function isDummyAllowed() {
  return (
    process.env.NODE_ENV !== "production" || process.env.SHOW_DUMMY === "1"
  );
}

export function visibleItems(list = []) {
  const allowDummy = isDummyAllowed();
  return list.filter((item) => {
    if (!item.published) return false;
    if (item.dummy) return allowDummy;
    return true;
  });
}
