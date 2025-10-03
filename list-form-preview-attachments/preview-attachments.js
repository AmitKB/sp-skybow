// Create preview image tile (thumbnail + link)
function createPreviewImageElement(tnImageUrl, actualImageUrl, fileName) {
  // Create wrapper div with "tile" class
  var $tile = jQuery("<div>", { class: "tile" });

  // Create link element pointing to the actual file
  var $link = jQuery("<a>", {
    href: actualImageUrl,
    title: fileName,
    target: "_blank",
    class: "tile-link",
  });

  // Create image element for the thumbnail
  var $img = jQuery("<img>", {
    src: tnImageUrl,
    alt: fileName,
    class: "tile-img",
  });

  // Build structure: link → img, then tile → link
  $link.append($img);
  $tile.append($link);

  return $tile;
}

// Build the SharePoint thumbnail preview URL
function buildFilePreviewUrl(fileAbsoluteUrl) {
  return (
    _spPageContextInfo.webAbsoluteUrl +
    "/_layouts/15/getpreview.ashx?path=" +
    fileAbsoluteUrl
  );
}

// Reference to the attachment object (provided externally)
let attachmentObject = [[Attachments]];

// Extract attachment items (array of file metadata)
let allAttachmentItems = attachmentObject.Attachments;

// Check if attachments exist
let hasAttachments =
  Array.isArray(allAttachmentItems) && allAttachmentItems.length > 0;
if (!hasAttachments) return;

// Root container for all thumbnails
let rootElement = jQuery("<div/>").css({ display: "flex" });

// Build all preview elements (one per attachment)
let collPreviewElements = allAttachmentItems.map(function (curAttachmentItem) {
  let fileName = curAttachmentItem.FileName;
  let curAttachmentFileUrl = attachmentObject.UrlPrefix + fileName;

  // Thumbnail preview URL
  let tnImageUrl = buildFilePreviewUrl(curAttachmentFileUrl);

  // Build the HTML element for thumbnail
  return createPreviewImageElement(tnImageUrl, curAttachmentFileUrl, fileName);
});

// Append all preview tiles to the root container
rootElement.append(collPreviewElements);

// Final HTML output (root wrapper + children)
let output = jQuery("<div/>").append(rootElement).html();

// Save final HTML in a global variable
window.attPreviewHtml = output;

// Optionally return the built HTML (for debugging if called manually)
return output;
