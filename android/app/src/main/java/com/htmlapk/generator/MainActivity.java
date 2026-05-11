package com.htmlapk.generator;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        bridge.getWebView().loadUrl(
            "file:///android_asset/public/app.html"
        );
    }

}