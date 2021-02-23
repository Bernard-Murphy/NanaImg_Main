# NanaImg
### [Live Site](https://nanaimg.net)

NanaImg is a simple and intuitive image host that provides ease of use for people who want to be in and out quickly, but also provides numerous features for people who want to stick around, browse, and interact with the images and users of the site. This is my latest and by far my biggest project.

## Uploading Images

Images are uploaded from the home page. When a user navigates to the home page, they will be presented with a simple image upload form where they can select an image from their computer to upload to the website. **OPTIONALLY**, he or she may copy/paste an image from another place on the internet onto the image upload form, and it will be selected to be uploaded. If a user clicks on "options", a list of options opens up, and a user may enter a name or a manifesto, disable the comments section, or mark the image NSFW.

If a user is logged in, they may then click upload, at which point their image (assuming it meets all of the requirements) will be uploaded, and upon success the user will be redirected to that images page. If the user is not logged in, they must solve a quick Google reCaptcha challenge, after which they may upload their image.

#### Image Upload Specifications
* Images must be no larger than 5MB
* Names must be no longer than 30 characters
* Manifestos must be no longer than 10,000 characters
* Allowed file types are png, jpeg, jpg, gif

#### Rules on NanaImg
* Pornography is not allowed
* Advertising is not allowed
* Spam is not allowed
* Illegal content is not allowed

## The Image Pages

Each image has a unique image ID which is one greater than the image that was just uploaded before it. For instance, there are currently 1497 images hosted on NanaImg. The next time someone uploads an image, their image will have an ID of 1498. The image ID is the number that is displayed at the top of the page above the image, and the "previous" and "next" buttons will navigate the user to the previous and next images, respectfully.

Below the image is the image direct link. This is what sites such as Reddit are looking for when you are making an image post and it asks for the image URL. If you click "Copy direct link", this link will be copied to your clipboard. On the bottom right, there is a report button that any user can use to report rule-breaking images. If there is a manifesto on the image, then another button will be there to report the manifesto. If the user is a moderator or admin, they may also remove the image or manifesto. On the bottom left is the number of views that the image has.

If the comments are not disabled, a user may click the "add a comment" button in order to open up the comment submission form. There are three fields here: A name field, which is optional, a comment field, which contains the comment, and an avatar field, which takes an image ID and is also optional. As with images, users that are not logged in must solve a Captcha before they upload, and vice-versa.

#### Comment Specifications
* Names must be no longer than 30 characters
* Comments must be no longer than 10,000 characters

Like images, comments can be reported, removed, and restored.

## The Browse Page

The browse page lists 49 images, which by default are the 49 most recent images. Users can use the next/previous buttons to navigate through images on the site. The user may also make use of the "Sort By" feature, which will allow the users to sort by most recently commented on, or popular. If the user selects "Popular", they may choose a time unit such as days, weeks, or months, and the number of that unit back in time that they would like to go. 

## Registering, Logging in, and Resetting a Forgotten Password

A user may register an account in order to bypass the site's Captcha requirements by going to NanaImg.net/register. Registration is like any other website, and a user must provide a username, email address, and password.

#### Account requirements
* Passwords must match
* Emails must be no longer than 128 characters
* Names must be no longer than 30 characters
* Passwords must be no longer than 256 characters
* Neither usernames, passwords, or emails can contain any backslashes

After a user registers their account, it must be approved by a site administrator. Once the user's account is approved, they may log in to their account by going to NanaImg.net/login. If a user forgets their password, they may click the "Forgot Password" button. From there, they must enter their username and email, and an email will be sent with a link to reset that user's password. The password reset form is the same as any other. Type two passwords in, and if they match and meet the specifications, the user's password will be changed.

## The User Dashboard

When a user logs in, they are redirected to their dashboard. There are three types of logged in users on NanaImg: verified users, moderators, and administrators. The dashboard of a verified user will only have one option, which is their user settings. In the user settings, a user can switch between posting anonymously or with their username showing. A moderator, in addition to the user settings, has access to the report queue. A report queue contains a list of all of the unprocessed user reports. For each report, a moderator is shown the ID of the content being reported, the type of content, the reason it was reported, a link to the content, the author, the date, the text content if applicable, and buttons to remove the content or remove the report. 

Admins, in addition to the user settings and the report queue, have access to the user registry, applicants, and action logs. In the user registry, an admin will see a list of users and can change their email addresses or write notes on their account. In the applicants section, admins can review registrations, select which position they will be approved for, then approve or deny their registration. Action logs contain all of the moderation actions taken on the site. This includes the removal and restoration of images, comments, and manifestos. Each action log contains the user, the date, the content ID, the reason for the action, a link to the action, and an option to reverse the action.
