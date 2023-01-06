<?php

header("Content-Type: application/json; charset=utf-8");
$host = "mysql21.ezhostingserver.com";
$user = "genwebdb";
$password = "G0ld-Rush!@#";
$dbname = "class_notes";

$db = new mysqli($host, $user, $password, $dbname);

$parsedurl = parse_url($_SERVER["REQUEST_URI"], PHP_URL_QUERY);

parse_str($parsedurl, $url);

$search = "";
if (isset($url["search"]) && is_string($url["search"])) {
  $s = '"%' . $url["search"] . '%"';
  $search =  " AND (First_Name LIKE " . $s . " OR Middle_Name LIKE " . $s . " OR Last_Name LIKE " . $s . " OR Nameplate LIKE " . $s . ") ";
}

$decade = "";
if (isset($url["decade"])) {
  $d = $url["decade"];
  if ($d !== "all") {
    $decade = " AND Graduation_Year BETWEEN $d AND " . ($d + 9) . " ";
  }
}

$offset = 0;
if (isset($url["offset"]) && is_numeric($url["offset"])) {
  $offset = $url["offset"];
}

$friendOrAlumni = "!";
if (isset($url["friendOrAlumni"])) {
  if ($url["friendOrAlumni"] == "friend") {
    $friendOrAlumni = "";
  }
}

$query = "SELECT id, Creation_Date, Graduation_Year, First_Name, Middle_Name, Last_Name, Personal_Update, Nameplate, Death_Date, Actual_Death_Date FROM `alumni-update` WHERE Active = \"True\"$search$decade AND Memoriam = \"Yes\" AND Graduation_Year $friendOrAlumni= 0 ORDER BY Actual_Death_Date DESC LIMIT 66 OFFSET $offset";
$results = $db->query($query);

$output = array();

$index = 0;
while ($r = mysqli_fetch_assoc($results)) {
  $output[$index] = array(
    "first_name" => $r["First_Name"],
    "middle_name" => $r["Middle_Name"],
    "last_name" => $r["Last_Name"],
    "graduation_year" => $r["Graduation_Year"],
    "death_date" => $r["Death_Date"],
    "actual_death_date" => $r["Actual_Death_Date"],
    "nameplate" => $r["Nameplate"]
  );

  $index++;
}

echo json_encode($output);
