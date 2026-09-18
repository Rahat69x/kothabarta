-- Migration: Remove shorter duplicate books that share identical cover images
-- Keeps only the longest story per cover group
-- Cascade automatically removes related parts, likes, bookmarks, comments

DELETE FROM public.stories
WHERE id IN (
  'd3bbeb63-e53a-45df-a378-bf78b9e26519', -- বৃষ্টিভেজা পঙক্তিমালা (3325 chars)
  '1305a474-9994-40e6-8dff-f591a9119d2e', -- শহরের বারোটা গল্প (3309 chars)
  '98caecea-8b2e-4f92-a56d-cd025282c0d0', -- রূপকথার শেষ পাতা (3305 chars)
  '673e8a64-b454-4e96-bf99-0cf9cac42c9d', -- উদ্বেগের সাথে বসবাস (2521 chars)
  '87e5fa6a-d5fa-4de2-a967-06acb60915b4', -- একজন শিক্ষকের গল্প (2518 chars)
  'c5ccd86e-8f83-4431-a510-4560c80cc24e', -- বরিশালের জলপথ (1661 chars)
  '8a89fae6-d73d-47dd-96cf-5a9b83ef0bcc', -- নাগরিকের চোখে নগর (2515 chars)
  '2b09dab5-8364-49c1-8fb3-dc830fb2f5eb', -- ভোর পাঁচটার অভ্যাস (1671 chars)
  '1ff83b31-4c50-4442-870a-5ada8f61ef8c', -- শেষ ট্রেনের যাত্রী (1671 chars)
  'fd035a30-7353-4ac6-ba9d-aea40ed1439c', -- পদ্মাপাড়ের মেয়ে (1669 chars)
  'a1de855a-704c-4d76-9630-b2a3a5cbd3d4', -- পলাশীর শেষ চিঠি (1665 chars)
  '21389dc2-49a0-4bb7-ab42-0c7b381aa38e', -- প্রথম চাকরির ছয় মাস (3321 chars)
  '2e1b5eb7-44c6-4b3f-a7e0-1b356471403f', -- কোয়ান্টাম কম্পিউটার কী (2533 chars)
  'cc500032-a4e6-41f5-a486-35ac7058c3fd', -- রিকশার হুড তোলা বিকেল (1677 chars)
  '92d18c49-a4ea-4427-96d8-bf918be85185', -- দুই বিশ্বযুদ্ধের বাংলা (2530 chars)
  'a65cfc55-c4be-45f7-a041-5e403677bbe7', -- ত্রিশ বছর বয়সে দাঁড়িয়ে (1685 chars)
  '5dad2f7e-646d-423d-83c1-6cd49df52c14', -- সহজ ভাষায় পরিসংখ্যান (1677 chars)
  '36453ed6-1700-44dc-a34d-9c2cfc03564a', -- বেহুলার নদীপথ (2503 chars)
  '3ba11420-a083-4c9f-af3a-dd0a7267d7b7', -- ভাগের সংসার (2497 chars)
  'c083bd8b-aecc-4cc3-8498-f2521023caf5', -- ২০৭১: ঢাকার আকাশে (1669 chars)
  '51b7171b-baff-42d5-9be0-2cec8b558747', -- দেবীর তৃতীয় চোখ (1667 chars)
  '28f7d86c-dcae-41f4-91f8-6bc3ec53f13d', -- টিফিনের ঘণ্টা (2503 chars)
  '6d37124b-7eb9-4a52-ac81-2e84fa73e894', -- একাত্তরের ভোর (2503 chars)
  'ca4edb3a-485e-4ea8-842c-5e186dfc39c8', -- অফিসের নতুন স্যার (3309 chars)
  '1be7ca4c-c53a-4713-8770-27e7824d4ada' -- তেরো নম্বর বাড়ি (3305 chars)
);
