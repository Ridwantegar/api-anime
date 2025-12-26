import * as v from "valibot";

const cihuynimeSchema = {
  query: {
    // ?page=1
    animes: v.optional(
      v.object({
        page: v.optional(
          v.pipe(
            v.string(),
            v.minLength(1),
            v.maxLength(6),
            v.regex(/^([1-9]\d*)$/, "Invalid page number")
          )
        ),
      })
    ),

    // ?q=naruto
    searchedAnimes: v.object({
      q: v.pipe(
        v.string(),
        v.minLength(1, "Minimal 1 karakter"),
        v.maxLength(50, "Maksimal 50 karakter")
      ),
    }),

    // untuk genre pagination
    genre: v.optional(
      v.object({
        page: v.optional(
          v.pipe(
            v.string(),
            v.minLength(1),
            v.maxLength(6),
            v.regex(/^([1-9]\d*)$/, "Invalid page number")
          )
        ),
      })
    ),
  },
};

export default cihuynimeSchema;
