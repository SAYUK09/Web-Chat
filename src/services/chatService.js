const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const fetchRooms = async () => {
  try {
    const response = await fetch(`${BASE_URL}/rooms`);
    if (!response.ok) {
      throw new Error("Failed to fetch rooms");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching rooms:", error.message);
    throw error;
  }
};

const fetchMessages = async (roomId) => {
  try {
    const response = await fetch(`${BASE_URL}/messages/${roomId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    throw error;
  }
};

const addMessage = async (roomId, userId, message, type) => {
  try {
    const response = await fetch(`${BASE_URL}/messages/${roomId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        message: message,
        type: type,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error.message);
    throw error;
  }
};

export { fetchRooms, fetchMessages, addMessage };
