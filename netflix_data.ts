#!/usr/bin/env -S deno run --allow-all --ext ts

import { assertEquals } from "https://deno.land/std@0.209.0/assert/assert_equals.ts";
import { parse } from "npm:csv-parse/sync";

interface Movie {
  title: string;
  isAvailableGlobally: boolean;
  releaseDate?: Date;
  hoursViewed: string;
}

function formatFile(file: string[][]): Movie[] {
  return file
    // trim empty start and end columns
    .map((row) => row.slice(1, -1))
    // convert row into a movie object
    .map((row) => ({
      title: row[0],
      isAvailableGlobally: row[1] === "Yes" ? true : false,
      releaseDate: row[2] === "" ? undefined : new Date(row[2]),
      hoursViewed: row[3],
    }));
}

function main(file: string[][]) {
  const movies = formatFile(file);

  console.log(movies.slice(0, 2));
}

if (import.meta.main) {
  const file: string[][] = parse(
    Deno.readTextFileSync("netflix.csv"),
    { fromLine: 7 },
  );

  main(file);
}

Deno.test("formats correctly", () => {
  assertEquals(
    formatFile(
      [
        ["", "The Night Agent: Season 1", "Yes", "2023-03-23", "812100000", ""],
        ["", "Ginny & Georgia: Season 2", "Yes", "2023-01-05", "665100000", ""],
      ],
    ),
    [
      {
        title: "The Night Agent: Season 1",
        isAvailableGlobally: true,
        releaseDate: new Date("2023-03-23T00:00:00.000Z"),
        hoursViewed: "812100000",
      },
      {
        title: "Ginny & Georgia: Season 2",
        isAvailableGlobally: true,
        releaseDate: new Date("2023-01-05T00:00:00.000Z"),
        hoursViewed: "665100000",
      },
    ],
  );
});
