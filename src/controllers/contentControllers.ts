import { Context } from "hono";
import TextContent from "../models/TextContentModel.js";
import MediaContent from "../models/MediaContentModel.js";
import CardContent from "../models/CardContentModel.js";
import mongoose from "mongoose";
import supabaseMediaUpload from "../lib/supabaseMediaUpload.js";
import connectDB from "../lib/mongoDB.js";
import { cloudinaryMediaUpload } from "../lib/cloudinary.js";

const contentTypes = ["text", "media", "card"];
const pages = [
  "home",
  "about",
  "solutions",
  "services",
  "industries",
  "contact",
];

const contentModels: Record<string, mongoose.Model<any>> = {
  text: TextContent,
  media: MediaContent,
  card: CardContent,
};

export const getContent = async (c: Context) => {
  const query = c.req.query();
  const { page, contentType } = query;

  if (!contentType)
    return c.json({ message: "please provide a content type to fetch" }, 400);
  if (!page)
    return c.json({ message: "please provide page to fetch data from" }, 400);
  if (!contentTypes.includes(contentType))
    return c.json({ message: `invalid content type ${contentType}` }, 400);
  if (!pages.includes(page))
    return c.json({ message: `could not find page ${page}` }, 400);

  const Model = contentModels[contentType];
  try {
    await connectDB();
    const data = await Model.findOne({ page });
    if (!data)
      return c.json(
        { message: `this page does not have ${contentType} content` },
        400
      );

    return c.json({ data }, 200);
  } catch (err) {
    return c.json({ message: "error fetching content", error: `${err}` }, 500);
  }
};

export const postContent = async (c: Context) => {
  const { contentType, page, blockType } = c.req.query();

  if (!contentType)
    return c.json({ message: "please provide a content type" }, 400);
  if (!page) return c.json({ message: "please provide page" }, 400);
  if (!blockType) return c.json({ message: "please provide block type" }, 400);

  if (!contentTypes.includes(contentType))
    return c.json({ message: `invalid content type ${contentType}` }, 400);
  if (!pages.includes(page))
    return c.json({ message: `could not find page ${page}` }, 400);

  await connectDB();
  // TEXT
  if (contentType === "text") {
    try {
      if (
        !c.req.header()["content-type"] ||
        c.req.header()["content-type"] !== "application/json"
      ) {
        return c.json({ message: "Invalid content type" }, 400);
      }

      const data = await TextContent.findOne({
        page,
        "content.block_type": blockType,
      });
      if (!data)
        return c.json(
          {
            message: "invalid block type",
          },
          400
        );

      const { title, subtitle, text } = await c.req.json();

      const updatedData = await TextContent.findByIdAndUpdate(
        data._id,
        {
          $set: {
            "content.$[item].title": title,
            "content.$[item].subtitle": subtitle,
            "content.$[item].text": text,
          },
        },
        { arrayFilters: [{ "item.block_type": blockType }], new: true }
      );

      if (!updatedData)
        return c.json({ message: "could not update data" }, 400);

      console.log(updatedData);
      
      return c.json({ message: "successfully updated data", updatedData }, 201);
    } catch (err: any) {
      return c.json(
        { message: "error updating text", error: err.message },
        500
      );
    }
  }

  // MEDIA
  if (contentType === "media") {
    console.log(c.req.header());
    if (
      !c.req.header()["content-type"] ||
      !c.req.header()["content-type"].startsWith("multipart/form-data")
    ) {
      return c.json({ message: "Invalid content type" }, 400);
    }

    try {
      const body = await c.req.formData();
      const file = body.get("media") as File;

      if (!file) return c.json({ message: "no file uploaded" }, 400);

      const data = await MediaContent.findOne({
        page,
        "content.block_type": blockType,
      });

      if (!data)
        return c.json(
          {
            message: "invalid block type",
          },
          400
        );

      const media_path = await cloudinaryMediaUpload(file);

      if (!media_path)
        return c.json({ message: "could not upload media to cloudinary" }, 400);

      const updatedData = await MediaContent.findOneAndUpdate(
        data._id,
        {
          $set: { "content.$[item].media_path": media_path },
        },
        { arrayFilters: [{ "item.block_type": blockType }], new: true }
      );

      if (!updatedData)
        return c.json({ message: "could not update data" }, 400);

      return c.json({ message: "success", updatedData }, 200);
    } catch (err: any) {
      return c.json({ message: "error", error: err.message }, 500);
    }
  }

  // CARD
  if (contentType === "card") {
    if (
      !c.req.header()["content-type"] ||
      c.req.header()["content-type"] !== "application/json"
    ) {
      return c.json({ message: "Invalid content type" }, 400);
    }

    const data = await CardContent.findOne({
      page,
      "content.block_type": blockType,
    });

    if (!data)
      return c.json(
        {
          message: "invalid block type",
        },
        400
      );

    const { cards } = await c.req.json();

    if (!cards || !Array.isArray(cards))
      return c.json({ message: "cards array is required" }, 400);

    const newCards = cards.map((card: any) => ({
      ...card,
      _id: new mongoose.Types.ObjectId(card._id),
    }));

    try {
      const updatedData = await CardContent.findOneAndUpdate(
        data._id,
        { $set: { "content.$[item].cards": newCards } },
        {
          arrayFilters: [{ "item.block_type": blockType }],
          new: true,
          strict: false,
        }
      );

      if (!updatedData)
        return c.json({ message: "could not update data" }, 400);

      return c.json({ message: "success", updatedData }, 201);
    } catch (err: any) {
      return c.json(
        { message: "error updating cards", error: err.message },
        500
      );
    }
  }
};
