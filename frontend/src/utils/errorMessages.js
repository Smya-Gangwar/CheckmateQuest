export const getErrorMessage = (error) => {
  const backendMessage = error.response?.data?.error;
  switch (backendMessage) {
    case "Room not found": return "Invalid room code. Please check and try again.";
    case "Team already exists": return "A team with this name already joined the room.";
    case "Room is full": return "This room has reached maximum team capacity.";
    case "Match already started": return "Match has already started. You cannot join now.";
    default: return (backendMessage || "Something went wrong.");
  }
};