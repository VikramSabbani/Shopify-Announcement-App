import { useFetcher } from "react-router";
import { authenticate } from "../shopify.server";
import { useState } from "react";
import { connectDB } from "../lib/mongodb.server";
import Announcement from "../models/Announcement";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const formData = await request.formData();
  const announcement = formData.get("announcement");

  await connectDB();

  const saved = await Announcement.create({
    announcement,
  });

  const shopResponse = await admin.graphql(`
    #graphql
    query{
      shop{
        id
      }
    }
  `);

  const shopData = await shopResponse.json();

  const metafieldResponse = await admin.graphql(
    `#graphql
  mutation metafieldsSet($metafields:[MetafieldsSetInput!]!){
    metafieldsSet(metafields:$metafields){
      metafields{
        id
      }
      userErrors{
        field
        message
      }
    }
  }`,
    {
      variables: {
        metafields: [
          {
            ownerId: shopData.data.shop.id,
            namespace: "my_app",
            key: "announcement",
            type: "single_line_text_field",
            value: announcement,
          },
        ],
      },
    },
  );

  const result = await metafieldResponse.json();

  if (result.data.metafieldsSet.userErrors.length > 0) {
    return {
      success: false,
      errors: result.data.metafieldsSet.userErrors,
    };
  }

  return {
    success: true,
  };
};

export default function Index() {
  const fetcher = useFetcher();

  const [announcement, setAnnouncement] = useState("");

  return (
    <s-page heading="Announcement Dashboard">
      <fetcher.Form method="post">
        <s-section heading="Announcement">
          <s-text-field
            label="Announcement Text"
            name="announcement"
            value={announcement}
            onInput={(e) => setAnnouncement(e.currentTarget.value)}
          />

          <br />

          <s-button type="submit" variant="primary">
            Save
          </s-button>
        </s-section>
      </fetcher.Form>
      {fetcher.data?.success && (
        <s-banner tone="success">Announcement Saved Successfully!</s-banner>
      )}
    </s-page>
  );
}
