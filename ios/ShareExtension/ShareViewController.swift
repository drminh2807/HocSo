//
//  ShareViewController.swift
//  ShareExtension
//
//  Created by Minh DrMinh on 9/25/23.
//

import UIKit
import Social
import UniformTypeIdentifiers

class ShareViewController: SLComposeServiceViewController {
    override func isContentValid() -> Bool {
        // Do validation of contentText and/or NSExtensionContext attachments here
        return true
    }

    override func didSelectPost() {
    }

    override func configurationItems() -> [Any]! {
        // To add configuration options via table cells at the bottom of the sheet, return an array of SLComposeSheetConfigurationItem here.
        return []
    }

  override func viewDidLoad() {
    super.viewDidLoad()
    
    extensionContext?.inputItems
  }
}
