import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { QuickActions } from "@/components/home/quick-actions";
import { AboutPreview } from "@/components/home/about-preview";
import { VisionMission } from "@/components/home/vision-mission";
import { LeadershipSection } from "@/components/home/leadership";
import { NewsSection } from "@/components/home/news-section";
import { CampaignsSection, EventsSection } from "@/components/home/campaigns-events";
import { OrganizationSection } from "@/components/home/organization-section";
import { GallerySection, VideoSection, JoinCta, DonationCta } from "@/components/home/home-cta";
import { ContactSection } from "@/components/home/contact-section";
import { getGalleryAlbums } from "@/data/gallery";
import { getVideos } from "@/data/gallery";
import { getSiteSettings } from "@/lib/api";
import { getBankDetails } from "@/data/donation";
import { buildMetadata } from "@/lib/seo";
import type { BankDetails, GalleryAlbum, Locale, SiteSettings, VideoItem } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale = params.lang === "mr" ? "mr" : "en";
  return buildMetadata({
    title: locale === "mr" ? "अधिकृत संकेतस्थळ" : "Official Website",
    description:
      locale === "mr"
        ? "जनहित लोकशाही पक्ष, महाराष्ट्र यांचे अधिकृत संकेतस्थळ. पक्षाची दृष्टी, नेतृत्व, जनहिताचे उपक्रम, बातम्या आणि कार्यक्रम जाणून घ्या."
        : "Explore the official website of Janhit Lokshahi Party, Maharashtra. Learn about the party's vision, leadership, public initiatives, news, and events.",
    path: "/",
    locale,
  });
}

export default async function HomePage({ params }: { params: { lang: string } }) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;

  let albums: GalleryAlbum[] = [];
  let videos: VideoItem[] = [];
  let settings: SiteSettings | undefined;
  const donation: BankDetails = await getBankDetails();
  try {
    [albums, videos] = await Promise.all([getGalleryAlbums(), getVideos()]);
  } catch {
    // Homepage must render even if the API is temporarily unavailable.
  }
  try {
    settings = (await getSiteSettings()) as SiteSettings;
  } catch {
    settings = undefined;
  }

  return (
    <>
      <Hero locale={locale} settings={settings} />
      <QuickActions locale={locale} />
      <div className="mt-16">
        <AboutPreview locale={locale} settings={settings} />
      </div>
      <VisionMission locale={locale} settings={settings} />
      <LeadershipSection locale={locale} />
      <h2 className="sr-only">News, Campaigns and Events</h2>
      <NewsSection locale={locale} />
      <CampaignsSection locale={locale} />
      <EventsSection locale={locale} />
      <OrganizationSection locale={locale} />
      <GallerySection locale={locale} albums={albums} />
      <VideoSection locale={locale} videos={videos} />
      <JoinCta locale={locale} />
      <DonationCta locale={locale} donation={donation} />
      <ContactSection locale={locale} settings={settings} />
    </>
  );
}