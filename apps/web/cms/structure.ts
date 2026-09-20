import type { StructureResolver } from "sanity/structure"

/**
 * Studio navigation. Articles are split by publication state so an editor can
 * see at a glance what is live and what is still a draft.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Articles")
        .child(
          S.list()
            .title("Articles")
            .items([
              S.listItem()
                .title("Published")
                .child(
                  S.documentTypeList("article")
                    .title("Published articles")
                    .filter('_type == "article" && publicationState == "published"'),
                ),
              S.listItem()
                .title("Drafts")
                .child(
                  S.documentTypeList("article")
                    .title("Draft articles")
                    .filter('_type == "article" && publicationState != "published"'),
                ),
              S.listItem()
                .title("All articles")
                .child(S.documentTypeList("article").title("All articles")),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("author").title("Authors"),
    ])
