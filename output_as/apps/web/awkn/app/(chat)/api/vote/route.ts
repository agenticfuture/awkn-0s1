import { auth } from "@/app/(auth)/auth";
import { getChatById, getVotesByChatId, voteMessage } from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter chatId is required."
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    // Embedded/public chats can be unauthenticated; keep UI stable.
    return Response.json([], { status: 200 });
  }

  const chat = await getChatById({ id: chatId });

  if (!chat) {
    // Chat may not be persisted in local bot DB for realm-routed sessions.
    return Response.json([], { status: 200 });
  }

  if (chat.userId !== session.user.id) {
    return Response.json([], { status: 200 });
  }

  const votes = await getVotesByChatId({ id: chatId });

  return Response.json(votes, { status: 200 });
}

export async function PATCH(request: Request) {
  const {
    chatId,
    messageId,
    type,
  }: { chatId: string; messageId: string; type: "up" | "down" } =
    await request.json();

  if (!chatId || !messageId || !type) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameters chatId, messageId, and type are required."
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new Response("Vote ignored for unauthenticated session", {
      status: 200,
    });
  }

  const chat = await getChatById({ id: chatId });

  if (!chat) {
    return new Response("Vote ignored for unknown chat", { status: 200 });
  }

  if (chat.userId !== session.user.id) {
    return new Response("Vote ignored for unauthorized chat", { status: 200 });
  }

  await voteMessage({
    chatId,
    messageId,
    type,
  });

  return new Response("Message voted", { status: 200 });
}
