Add-Type -AssemblyName System.Drawing

$outputPath = Join-Path (Get-Location) 'public/portfolio-og.png'
$logoPath = Join-Path (Get-Location) 'src/assets/bonotech-logo-mono2.png'
$width = 1200
$height = 630
$bitmap = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

function New-RoundedPath([float]$x, [float]$y, [float]$w, [float]$h, [float]$radius) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

try {
    $background = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point($width, $height)),
        ([System.Drawing.Color]::FromArgb(255, 10, 7, 17)),
        ([System.Drawing.Color]::FromArgb(255, 31, 13, 50))
    )
    $graphics.FillRectangle($background, 0, 0, $width, $height)
    $background.Dispose()

    $glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $glowPath.AddEllipse(705, 25, 520, 560)
    $glow = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
    $glow.CenterColor = [System.Drawing.Color]::FromArgb(110, 120, 50, 190)
    $glow.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 90, 35, 145))
    $graphics.FillPath($glow, $glowPath)
    $glow.Dispose()
    $glowPath.Dispose()

    $linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(30, 221, 190, 255), 1)
    foreach ($x in @(790, 870, 950, 1030, 1110)) { $graphics.DrawLine($linePen, $x, 70, $x, 560) }
    foreach ($y in @(110, 190, 270, 350, 430, 510)) { $graphics.DrawLine($linePen, 740, $y, 1160, $y) }
    $linePen.Dispose()

    $logo = [System.Drawing.Image]::FromFile($logoPath)
    $graphics.DrawImage($logo, 70, 58, 355, 51)
    $logo.Dispose()

    $eyebrowFont = New-Object System.Drawing.Font('Segoe UI', 13, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $headingFont = New-Object System.Drawing.Font('Segoe UI', 63, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $bodyFont = New-Object System.Drawing.Font('Segoe UI', 21, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $footerFont = New-Object System.Drawing.Font('Segoe UI', 13, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(247, 242, 255))
    $lavender = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(203, 165, 242))
    $muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(204, 191, 222))

    $graphics.DrawString('OUR PORTFOLIO', $eyebrowFont, $lavender, 74, 179)
    $graphics.DrawString('Digital products.', $headingFont, $white, 70, 220)
    $graphics.DrawString('Built for business.', $headingFont, $lavender, 70, 294)
    $graphics.DrawString('Custom software and connected platforms,', $bodyFont, $muted, 76, 405)
    $graphics.DrawString('engineered to move businesses forward.', $bodyFont, $muted, 76, 438)

    $backPath = New-RoundedPath 914 139 220 324 22
    $backBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(225, 236, 220, 250))
    $graphics.FillPath($backBrush, $backPath)
    $backBrush.Dispose()
    $backPath.Dispose()

    $midPath = New-RoundedPath 852 159 220 324 22
    $midBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245, 195, 164, 230))
    $graphics.FillPath($midBrush, $midPath)
    $midBrush.Dispose()
    $midPath.Dispose()

    $frontPath = New-RoundedPath 789 179 220 324 22
    $cardBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(789, 179)),
        (New-Object System.Drawing.Point(1009, 503)),
        ([System.Drawing.Color]::FromArgb(255, 128, 54, 196)),
        ([System.Drawing.Color]::FromArgb(255, 53, 23, 89))
    )
    $graphics.FillPath($cardBrush, $frontPath)
    $cardPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(225, 217, 177, 255), 2)
    $graphics.DrawPath($cardPen, $frontPath)
    $cardPen.Dispose()
    $cardBrush.Dispose()
    $frontPath.Dispose()

    $markPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(110, 239, 220, 255), 2)
    foreach ($d in @(128, 88, 48)) { $graphics.DrawEllipse($markPen, 899 - ($d / 2), 318 - ($d / 2), $d, $d) }
    $markPen.Dispose()
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 225, 197, 255))
    $graphics.FillEllipse($accentBrush, 891, 310, 16, 16)
    $graphics.FillRectangle($accentBrush, 865, 358, 11, 11)
    $graphics.FillRectangle($accentBrush, 930, 347, 9, 9)
    $accentBrush.Dispose()

    $graphics.DrawString('SELECTED WORK', $footerFont, $white, 814, 431)
    $graphics.DrawString('SOFTWARE  ·  PLATFORMS  ·  AI', $footerFont, $muted, 76, 553)

    $white.Dispose()
    $lavender.Dispose()
    $muted.Dispose()
    $eyebrowFont.Dispose()
    $headingFont.Dispose()
    $bodyFont.Dispose()
    $footerFont.Dispose()

    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output "Created $outputPath"
} finally {
    $graphics.Dispose()
    $bitmap.Dispose()
}
