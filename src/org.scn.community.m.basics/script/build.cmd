del ..\contribution.xml /q

type ..\..\org.scn.community.shared\templates.main\contribution.xml.head.txt ^
..\templates\contribution.xml.head.txt ^
..\..\org.scn.community.shared\templates.main\eula.xml.txt ^
..\..\org.scn.community.shared\templates.main\license.xml.txt ^
..\templates\contribution.xml.groups.txt ^
..\res\AppHeader\def\contribution.xml ^
..\res\Bar\def\contribution.xml ^
..\res\Button\def\contribution.xml ^
..\res\SegmentedButton\def\contribution.xml ^
..\res\Switch\def\contribution.xml ^
..\res\Toolbar\def\contribution.xml ^
..\..\org.scn.community.shared\templates.main\contribution.xml.close.txt > ^
..\contribution.xml

del ..\contribution.ztl /q

type ..\..\org.scn.community.shared\templates.main\contribution.ztl.head.txt ^
..\templates\contribution.ztl.head.txt ^
..\..\org.scn.community.shared\templates.main\license.js.txt ^
..\res\AppHeader\def\contribution.ztl ^
..\res\Bar\def\contribution.ztl ^
..\res\Button\def\contribution.ztl ^
..\res\SegmentedButton\def\contribution.ztl ^
..\res\Switch\def\contribution.ztl ^
..\res\Toolbar\def\contribution.ztl ^
..\..\org.scn.community.shared\templates.main\contribution.ztl.close.txt > ^
..\contribution.ztl

del ..\META-INF\MANIFEST.MF /q

type ..\..\org.scn.community.shared\templates.main\MANIFEST.MF ^
..\templates\MANIFEST.MF > ^
..\META-INF\MANIFEST.MF
