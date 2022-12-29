import Pusher from "pusher";

export default async function handler(req, res) {
    // const { chat } = req.body;
    // console.log(chat);
    console.log(req.body.chat);
    const pusher = new Pusher({
      appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      secret: process.env.NEXT_PUBLIC_PUSHER_APP_SECRET,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      useTLS: true
    });


    await pusher.trigger("my-channel", "my-event", {
      message: req.body.chat
    });

    res.status(200).json({ name: 'John Doe' })
  }