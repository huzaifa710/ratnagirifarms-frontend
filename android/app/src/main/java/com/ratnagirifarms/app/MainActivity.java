package com.ratnagirifarms.app;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceError;
import android.webkit.WebSettings;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.content.Context;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    private WebView webView;
    private ConnectivityManager connectivityManager;
    private ConnectivityManager.NetworkCallback networkCallback;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        webView = getBridge().getWebView();
        
        // Configure WebView settings
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        
        // Set custom WebViewClient
        webView.setWebViewClient(new CustomWebViewClient());
        
        // Load main URL
        webView.loadUrl("https://ratnagirifarms.com");
        
        // Setup network monitoring
        setupNetworkMonitoring();
    }
    
    private class CustomWebViewClient extends WebViewClient {
        
        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            // Only show offline page for main frame errors
            if (request.isForMainFrame()) {
                view.loadUrl("file:///android_asset/public/offline.html");
            }
        }
        
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            // Keep navigation within WebView
            String url = request.getUrl().toString();
            if (url.startsWith("https://ratnagirifarms.com")) {
                return false; // Let WebView handle it
            }
            return false;
        }
    }
    
    private void setupNetworkMonitoring() {
        connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        
        networkCallback = new ConnectivityManager.NetworkCallback() {
            @Override
            public void onAvailable(Network network) {
                runOnUiThread(() -> {
                    if (webView != null) {
                        String currentUrl = webView.getUrl();
                        if (currentUrl != null && currentUrl.contains("offline.html")) {
                            // Force reload the live site
                            webView.loadUrl("https://ratnagirifarms.com");
                        }
                    }
                });
            }
            
            @Override
            public void onLost(Network network) {
                // Network lost - show offline page if not already there
                runOnUiThread(() -> {
                    if (webView != null) {
                        String currentUrl = webView.getUrl();
                        if (currentUrl != null && !currentUrl.contains("offline.html")) {
                            webView.loadUrl("file:///android_asset/public/offline.html");
                        }
                    }
                });
            }
        };
        
        NetworkRequest networkRequest = new NetworkRequest.Builder()
                .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                .build();
        
        connectivityManager.registerNetworkCallback(networkRequest, networkCallback);
    }
    
    @Override
    public void onResume() {
        super.onResume();
        
        // Check network and reload if back online
        if (isNetworkAvailable() && webView != null) {
            String currentUrl = webView.getUrl();
            if (currentUrl != null && currentUrl.contains("offline.html")) {
                webView.loadUrl("https://ratnagirifarms.com");
            }
        }
    }
    
    @Override
    public void onDestroy() {
        super.onDestroy();
        // Unregister network callback to prevent memory leaks
        if (connectivityManager != null && networkCallback != null) {
            connectivityManager.unregisterNetworkCallback(networkCallback);
        }
    }
    
    private boolean isNetworkAvailable() {
        if (connectivityManager != null) {
            Network network = connectivityManager.getActiveNetwork();
            NetworkCapabilities capabilities = connectivityManager.getNetworkCapabilities(network);
            return capabilities != null &&
                   (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
                    capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR));
        }
        return false;
    }
}