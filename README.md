# Scaffolding CLI for Page Builder modules

`pbmodules` is a CLI for scaffolding both custom and extension modules for Page Builder content types.

## Usage
1. Clone or download this repo.
1. CD into the `pbmodules` directory and run `npm install` to download package dependencies.
1. Run `npm install -g pbmodules` to install the scaffolding CLI globally.
1. Navigate to where you want to create your Page Builder module (see TIP below).
1. Enter `pbmodules` at the command prompt and follow the instructions.

> TIP: After installing pbmodules globally, we recommend navigating to the `app/code/` directory of your magento instance and run `pbmodules` there. If you do this, you can run `bin/magento setup:upgrade` to install the new module and begin using / developing it immediately. You can be up and running with a variety of Page Builder modules within minutes.

## Scaffolding Page Builder extension modules

To scaffold an extension module, select the **Extend** option from the first question and follow the instructions.

- **Choose a Page Builder content type to extend**: You can choose from a list of Page Builder's native content types, including, `column-groups`, `button-items`, and `tab-items`, and `slide`.

- **Enter your vendor name**: The vendor name is usually and abbreviated company name that serves as a namespace for your module and content type. It should be one word, a capitalized abbreviation. If it must be more than one word, use PascalCase.

- **Enter your module name**: The module name should also be one word (if possible) and capitalized. If it must be more than one word, use PascalCase. The module name should identify the Page Builder content type you are extending.

- **Enter your module description**: This is optional, but a simple default is provided. The module description is only used in the module's `composer.json`, which can be changed easily enough.

### Extension example
This example shows how to create a Page Builder skeleton module that extends the Page Builder Banner:

![Page Builder Custom Module](pb-extension.gif "Creating an extension module")

## Scaffolding Page Builder custom modules

To scaffold a custom module, select the **Custom** option from the first question and follow the instructions.

- **Enter custom name**: This is name for your custom content type name. It should be capitalized and only one word if possible. If you need to use two words, use PascalCase to name it.

- **Enter custom menu name**: The menu name is the name you want displayed for your content type within the Page Builder panel on the left side of the page. This name should be one or two words max (if possible) so that the name isn't cropped when displayed.

- **Enter your vendor name**: The vendor name is usually and abbreviated company name that serves as a namespace for your module and content type. It should be one word, a capitalized abbreviation. If it must be more than one word, use PascalCase.

- **Enter your module name**: The module name should also be one word (if possible) and capitalized. If it must be more than one word, use PascalCase. The module name should identify the Page Builder content type in some way.

- **Enter your module description**: This is optional, but a simple default is provided. The module description is only used in the module's `composer.json`, which can be changed easily enough.

### Custom example

This example shows how to create a custom Page Builder skeleton module using the defaults:

![Page Builder Custom Module](pb-custom.gif "Creating a custom module")

## Installing the skeleton modules

As with all Magento modules, to install your new skeleton module:

1. Add your vendor-module directory to the `app/code/` directory of your Magento installation.
1. Navigate to your magento root directory, and run:

   ```bash
   bin/magento setup:upgrade
   ```

## Feedback
We encourage and welcome you to help us keep these examples current by submitting pull requests and issues.  We also welcome your feedback and ideas on other code examples you would like to see added to this repo.

## Slack
You can join our #pagebuilder channel, within magentocommeng.slack.com, to post your questions to the Page Builder community.
