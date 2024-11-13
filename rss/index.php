<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Disposition, Content-Type, Content-Length, Accept-Encoding");
header("Content-type:application/json");

// tumblr
$ch = curl_init();
$options = array(
  CURLOPT_URL => 'https://cocolabjp.tumblr.com/rss',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FRESH_CONNECT => true,
  CURLOPT_HTTPHEADER => array("Cache-Control: no-cache")
);
curl_setopt_array($ch, $options);
$feed  = curl_exec($ch);
$invalid_characters = '/[^\x9\xa\x20-\xD7FF\xE000-\xFFFD]/';
$feed = preg_replace($invalid_characters, '', $feed);
$tumblr_rss = simplexml_load_string($feed);

// note
$ch = curl_init();
$options = array(
  CURLOPT_URL => 'https://note.com/cocolabjp/m/m8dc0c6036545/rss',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FRESH_CONNECT => true,
  CURLOPT_HTTPHEADER => array("Cache-Control: no-cache")
);
curl_setopt_array($ch, $options);
$feed  = curl_exec($ch);
$invalid_characters = '/[^\x9\xa\x20-\xD7FF\xE000-\xFFFD]/';
$feed = preg_replace($invalid_characters, '', $feed);
$note_rss = simplexml_load_string($feed);
?>
{"news": [<?php
$articles = $tumblr_rss->channel->item;
for($i = 0; $i < count($articles); $i++) {
  echo '{'.
          '"title": "' . $articles[$i]->title . '",' .
          '"url": "' . $articles[$i]->link . '",' .
          '"date": "' . $articles[$i]->pubDate . '"' .
       '}';
  if($i+1 < count($articles)) { echo ","; }
}
?>],"blog": [<?php
$articles = $note_rss->channel->item;
for($i = 0; $i < count($articles); $i++) {
  echo '{'.
          '"title": "' . $articles[$i]->title . '",' .
          '"url": "' . $articles[$i]->link . '",' .
          '"date": "' . $articles[$i]->pubDate . '"' .
       '}';
  if($i+1 < count($articles)) { echo ","; }
}
?>]}
