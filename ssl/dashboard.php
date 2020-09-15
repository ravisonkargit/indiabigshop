<?php

require_once('access.php');

include('header.php');
include('array_column.php');
$companygroup= $_SESSION['companygroup'];
$companyid= $_SESSION['companyid'];
$companyids= $_SESSION['companyids'];
$companies= $_SESSION['companies'];
$companycode= $_SESSION['companycode'];
$KHcode= $_SESSION['KHcode'];
$obj=new project();
$groupid=$_SESSION['groupid'];

if($groupid=="15" || $groupid=="17") {
  //  $row = $obj->select_data("*", "view_po_date_range", "1")[0];
}

//$res=$obj->select_data("count(1) as cnt","view_PO_List_Expiring","pdays >30 and company_id in($companyids)");
//$res=$res[0];



$reject=$obj->select_data("count(1) as cnt","tbl_purchase_master","(acc_approve like '%Reject - High Price%'
  or hod_approve like '%Reject - High Price%' or ceo_approve like '%Reject - High Price%') and company_id in($companyids) ");
$reject=$reject[0];

$mrn=$obj->select_data("count(1) as cnt","tbl_mrn","mrnid not in(select distinct mrnid from tbl_po_mrn) and  companyid in($companyids)");
$mrn=$mrn[0];

$inward=$obj->select_data("count(1) as cnt","tbl_invoice","store_approvel='0' and dn_invoice_id='0' and deleted='0' and company_id in($companyids)");
$inward=$inward[0];
$uk=$obj->select_data("date_format(sdate,'%d-%M') as dt ,id,country,company","tbl_shipment_plan"," company in($companies) and sdate>=NOW() and country ='UK' order by sdate limit 0,3");
$usa=$obj->select_data("date_format(sdate,'%d-%M') as dt ,id,country,company","tbl_shipment_plan"," company in($companies) and sdate>=NOW() and country ='UK' order by sdate limit 0,3");


$deptid= $_SESSION['deptid'];
$url='#';
if($deptid=='3')
{
    $url='shipment_packing.php';
}
else if($deptid=='2')
{
    $url='shipment_plan.php';
}

$day=date('d');
$mm=date('m');
$bday=$obj->select_data("*","view_employee","day(dob)='$day' and month(dob)='$mm' ");
$names='Happy Birthday ';
foreach ($bday as $bd)
{
    $names=$names.", ".$bd['Username']." ( ".$bd['dept']." ) ";
}


//$res = $obj->select_data("sum(qty) as qty,dname", "view_last7day_orders", "company in($companies) group by sysdate order by sysdate ");

$lastyeardayPoint = $obj->select_data("s.hh as x,   @b := @b + s.qty AS y", "(SELECT @b := 0) AS dummy CROSS JOIN tbl_db_last_year_same_day_order AS s ",
    "s.company in($companies) order by x");

//$lastmonthdayPoint = $obj->select_data("s.hh as x,   @b := @b + s.qty AS y", "(SELECT @b := 0) AS dummy CROSS JOIN tbl_db_last_month_same_day_order AS s ",
//    "s.company in($companies) order by x");

$lastdayPoint =$obj->select_data("s.hh as x,   @b := @b + s.qty AS y", "(SELECT @b := 0) AS dummy CROSS JOIN view_last_day_order AS s ",
    "s.company in($companies) order by x");

$lasttodayPoint =$obj->select_data("s.mm as x,   @b := @b + s.qty AS y", "(SELECT @b := 0) AS dummy CROSS JOIN view_last_today_order AS s ",
    "s.company in($companies) order by x");


$outofstock =$obj->select_data("count(1) as cnt ,country", "tbl_db_out_of_stock","company in($companies) group by country order by country desc");


$dataPoints1week = $obj->select_data("sum(qty) as y,sysdate as label", "tbl_db_last7day_orders_last_year", "company in($companies) group by sysdate order by sysdate ");

$dataPoints2week = $obj->select_data("sum(qty) as y,sysdate as label", "view_last7day_orders", "company in($companies) group by sysdate order by sysdate ");



$weekAvg1=array_sum(array_column($dataPoints1week, 'y'));
$weekAvg2=array_sum(array_column($dataPoints2week, 'y'));


$dataPoints1Year = $obj->select_data("sum(qty) as y,sysdate as label", "tbl_db_last30day_orders_last_year", "company in($companies) group by sysdate order by sysdate ");

$dataPoints2Year = $obj->select_data("sum(qty) as y,sysdate as label", "view_last30day_orders", "company in($companies) group by sysdate order by sysdate ");

$yearAvg1=array_sum(array_column($dataPoints1Year, 'y'));
$yearAvg2=array_sum(array_column($dataPoints2Year, 'y'));


if($groupid=="15") {
    $dataBig1 = $obj->select_data("sum(qty) as y,sysdate as label", "tbl_db_last7day_orders_last_year", "company='BIG' group by sysdate order by sysdate ");
    $dataBig2 = $obj->select_data("sum(qty) as y,sysdate as label", "view_last7day_orders", "company='BIG' group by sysdate order by sysdate ");

    $AvgBig1 = array_sum(array_column($dataBig1, 'y'));
    $AvgBig2 = array_sum(array_column($dataBig2, 'y'));

    $dataTW1 = $obj->select_data("sum(qty) as y,sysdate as label", "tbl_db_last7day_orders_last_year", "company='TW' group by sysdate order by sysdate ");
    $dataTW2 = $obj->select_data("sum(qty) as y,sysdate as label", "view_last7day_orders", "company='TW' group by sysdate order by sysdate ");

    $AvgTW1 = array_sum(array_column($dataTW1, 'y'));
    $AvgTW2 = array_sum(array_column($dataTW2, 'y'));

    $dataPMK1 = $obj->select_data("sum(qty) as y,sysdate as label", "tbl_db_last7day_orders_last_year", "company='PMK' group by sysdate order by sysdate ");
    $dataPMK2 = $obj->select_data("sum(qty) as y,sysdate as label", "view_last7day_orders", "company='PMK' group by sysdate order by sysdate ");

    $AvgPMK1 = array_sum(array_column($dataPMK1, 'y'));
    $AvgPMK2 = array_sum(array_column($dataPMK2, 'y'));

    $dataWH1 = $obj->select_data("sum(qty) as y,sysdate as label", "tbl_db_last7day_orders_last_year", "company='WH' group by sysdate order by sysdate ");
    $dataWH2 = $obj->select_data("sum(qty) as y,sysdate as label", "view_last7day_orders", "company='WH' group by sysdate order by sysdate ");

    $AvgWH1 = array_sum(array_column($dataWH1, 'y'));
    $AvgWH2 = array_sum(array_column($dataWH2, 'y'));

    $dataHND1 = $obj->select_data("sum(qty) as y,sysdate as label", "tbl_db_last7day_orders_last_year", "company='HND' group by sysdate order by sysdate ");
    $dataHND2 = $obj->select_data("sum(qty) as y,sysdate as label", "view_last7day_orders", "company='HND' group by sysdate order by sysdate ");

    $AvgHND1 = array_sum(array_column($dataHND1, 'y'));
    $AvgHND2 = array_sum(array_column($dataHND2, 'y'));

    $dataSNK1 = $obj->select_data("sum(qty) as y,sysdate as label", "tbl_db_last7day_orders_last_year", "company='STARNK' group by sysdate order by sysdate ");
    $dataSNK2 = $obj->select_data("sum(qty) as y,sysdate as label", "view_last7day_orders", "company='STARNK' group by sysdate order by sysdate ");

    $AvgSNK1 = array_sum(array_column($dataSNK1, 'y'));
    $AvgSNK2 = array_sum(array_column($dataSNK2, 'y'));

    $dataNYGT1 = $obj->select_data("sum(qty) as y,sysdate as label", "tbl_db_last7day_orders_last_year", "company='NYGT' group by sysdate order by sysdate ");
    $dataNYGT2 = $obj->select_data("sum(qty) as y,sysdate as label", "view_last7day_orders", "company='NYGT' group by sysdate order by sysdate ");


    $AvgNYGT1 = array_sum(array_column($dataNYGT1, 'y'));
    $AvgNYGT2 = array_sum(array_column($dataNYGT2, 'y'));

    $datacompany1= $obj->select_data("sum(qty) as y,company as label", "view_last30day_orders_last_year", "company in($companies) group by company order by company ");
    $datacompany2 = $obj->select_data("sum(qty) as y,company as label", "view_last30day_orders", "company in($companies) group by company order by company ");
}



    $datacomp1 = $obj->select_data("sum(qty) as y,sysdate as label", "view_last30day_orders_country",
        "company in($companies) and ccode='USA' group by sysdate,ccode order by sysdate ");
    $datacomp2 = $obj->select_data("sum(qty) as y,sysdate as label", "view_last30day_orders_country",
        "company in($companies) and ccode='UK' group by sysdate,ccode order by sysdate ");

    $Avgcomp1 = array_sum(array_column($dataTW1, 'y'));
    $Avgcomp2 = array_sum(array_column($dataTW2, 'y'));

    if($companycode!='') {
        $datacountry1 = $obj->select_data("sum(qty) as y,country as label", "view_last30day_orders_last_year", "company in($companycode) group by country order by country ");
        $datacountry2 = $obj->select_data("sum(qty) as y,country as label", "view_last30day_orders", "company in($companycode) group by country order by country ");
    }


    $top_product=$obj->select_data("sum(qty) as y,msku as label","tbl_db_orders_monthly","msku!='' 
and msku!='M00001' and sysdate>=DATE_ADD(NOW(),INTERVAL -1 MONTH) and company in($companies) and msku is not null 
 group by msku order by sum(qty) desc limit 50;");

//    echo $KHcode;
$targets=$obj->select_data("*","view_monthly_ecom_target","company in($KHcode) order by qty desc");

?>


<div class="clearfix">
</div>
<!-- BEGIN CONTAINER -->

<div class="page-container">
    <!-- BEGIN SIDEBAR -->
    <?php require_once('sidebar.php'); ?>
    <!-- END SIDEBAR -->
    <!-- BEGIN CONTENT -->

    <!-- BEGIN CONTENT -->
    <div class="page-content-wrapper">
        <div class="page-content">

            <div class="row">

                <div class="col-md-12">
                    <!-- BEGIN EXAMPLE TABLE PORTLET-->
                    <div class="portlet box blue">
                        <div class="portlet-title">
                            <div class="caption">
                                <i class="fa fa-edit"></i>DashBoard
                            </div>

                        </div>
                        <?php if (sizeof($bday)>0)
                        {?>
                        <div class="portlet-title">
                            <div class="caption" style="width: 100%!important;">
                                <marquee><?php echo $names ; ?></marquee>
                            </div>
                        </div>
                        <?php }?>
                        <div class="portlet-body">
                            <div class="row">
                                <div class="col-md-2">
                                    <a href="mrn_list.php?type=0">
                                    <div class="alert alert-success" style="background-color: yellow;">
                                        <h3><b><?php echo "MRN Pending  (".$mrn['cnt']." )";?></b></h3>

                                     </div> </a>
                                </div>

                                <div class="col-md-2">
                                    <a href="purchase_view.php?status=R">
                                    <div class="alert alert-success" style="background-color: orange;color: white;">
                                        <h3><b><?php echo "PO Rejected  (".$reject['cnt']." )";?></b></h3>
                                    </div></a>
                                </div>
                                <div class="col-md-2">
                                    <a href="expired_po.php?typ=E">
                                    <div class="alert alert-success" style="background-color: red;color: white;">
                                        <h3><b><?php echo "PO Delayed (".$res['cnt']." )";?></b></h3>

                                    </div> </a>
                                </div>
                                <div class="col-md-2">
                                    <a href="inward.php?typ=E">
                                        <div class="alert alert-success" style="background-color: blue;color: white;">
                                            <h3><b><?php echo "Inward Pending (".$inward['cnt']." )";?></b></h3>

                                        </div> </a>
                                </div>
                                <div class="col-md-2">

                                        <div class="alert alert-success" style="background-color: lightpink;color: green;padding-top: 13px;
    padding-bottom: 4px;">
                                            <h4><b><?php echo "USA Shipment";?></b></h4>
                                            <?php foreach ($usa as $r)
                                            {
                                                $id=$r['id'];
                                            echo "<a color='white'  href='$url?id=$id' ><h5><b>".$r['dt']."-".$r['company']."</b></h5></a> ";
                                            }?>

                                        </div>

                                </div>
                                <div class="col-md-2">

                                    <div class="alert alert-success" style="background-color: lightseagreen;color: white;padding-top: 13px;
    padding-bottom: 4px;">
                                        <h4><b><?php echo "UK Shipment";?></b></h4>
                                        <?php foreach ($uk as $r)
                                        {$id=$r['id'];
                                            echo "<a style='color:white;'  href='$url?id=$id' ><h5><b>".$r['dt']."-".$r['company']."</b></h5></a>";

                                        }?>

                                    </div>

                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="alert alert-success">
                                        <strong>Last 7 Days
                                            : Avg <?php echo " Last Year  <b>". intval( $weekAvg1/7)."</b> Current Year  <b>". intval($weekAvg2/7)." </b> 
 <span style='background-color: yellow;color: green;font-size: 16pt;'> " .sprintf('%0.2f',(($weekAvg2/$weekAvg1)*100))." % </span>" ; ?>
                                        </strong>
                                    </div>

                                    <div id="barChartAll" style="height: 370px; width: 100%;"></div>

                                </div>


                                <div class="col-md-6">
                                    <div class="col-md-6">
                                        <a target="_blank" href="out_of_stock.php?country=USA">
                                            <div class="alert alert-success" style="background-color: orange;color: white;">
                                                <h3><b><?php echo "USA ReStock  (".$outofstock[0]['cnt']." )";?></b></h3>
                                            </div></a>
                                    </div>

                                    <div class="col-md-6">
                                        <a target="_blank" href="out_of_stock.php?country=UK">
                                            <div class="alert alert-success" style="background-color: red;color: white;">
                                                <h3><b><?php echo "UK ReStock (".$outofstock[1]['cnt']." )";?></b></h3>

                                            </div> </a>
                                    </div>
                                    <div class="col-md-6">
                                        <a target="_blank" href="rakhi_sell.php">
                                            <div class="alert alert-success" style="background-color: blue;color: white;">
                                                <h3><b><?php echo "Rakhi Target Wise";?></b></h3>

                                            </div> </a>
                                    </div>

                                    <div class="col-md-6">
                                        <a target="_blank" href="rakhi_top_selling.php">
                                            <div class="alert alert-success" style="background-color: green;color: white;">
                                                <h3><b><?php echo "Rakhi Top Selling";?></b></h3>

                                            </div> </a>
                                    </div>

                                </div>

                                </div>

                            <div class="row">
                            <div class="col-md-12">
                                <div class="alert alert-success">
                                    <strong>  <span style="font-size: 14px;font-weight: bold;">
                                                Target Vs Achievement, Avg. till Now </span>
                                    </strong>

                                </div>

                                <div>
                                    <table class="table table-striped table-hover table-bordered" style="margin: 0px" id="sample_editable_1">
                                        <tr>
                                            <th>Sr. No.</th><th>CMP</th><th>CNT</th><th>Targt</th>
                                            <th style="min-width:100px">Achive(%)</th><th>Inctv</th>
                                            <th>Cumulative Incentive</th>

                                        </tr>
                                        <?php
                                        $k=1;
                                        $target=0;
                                        $achive=0;
                                        foreach ($targets as $row)
                                        {

                                            $target=$target+intval($row['target']);
                                            $achive=$achive+intval($row['achive']);

                                            $target1=intval($row['target']);
                                            $achive1=$row['achive'];

                                            $ctarget1=intval($row['ctarget']);
                                            $cachive1=$row['cachive'];

                                            if($achive1>=$target1)
                                            {
                                                $incv=$achive1;
                                            }
                                            else
                                            {
                                                // $incv=(1-round(($achive1/$target1),2))*-intval($row['target']);
                                                $incv=($target1-$achive1)*-1;
                                            }
                                            if($cachive1>=$ctarget1)
                                            {
                                                $cincv=$cachive1;
                                            }
                                            else
                                            {
                                                // $incv=(1-round(($achive1/$target1),2))*-intval($row['target']);
                                                $cincv=($ctarget1-$cachive1)*-1;
                                            }

                                            $incentive=intval($incv*50);
                                            $cincentive=intval($cincv*50);

                                            $amt=$amt+$incentive;
                                            if(intval($row['qty'])<100)
                                            {
                                                $bg="red";
                                            }
                                            else
                                            {
                                                $bg="green";

                                            }

                                            ?>
                                            <tr>
                                                <td><?php echo $k; ?></td>
                                                <td><?php echo $row['company']; ?></td>
                                                <td><?php echo $row['country']; ?></td>
                                                <td><?php echo $row['target']; ?></td>
                                                <td><?php echo $row['achive']." (".$row['qty'].") "; ?></td>

                                                <td style="background-color:<?php echo $bg;?>; color: white;" >
                                                    <?php echo $incentive; ?></td>
                                                <td style="background-color:<?php echo $bg;?>; color: white;" >
                                                    <?php echo $cincentive; ?></td>
                                            </tr>
                                            <?php

                                            $k++;
                                        }

                                        ?>
                                        <tr><th></th>
                                            <th colspan="2">Total</th>
                                            <th><?php echo $target; ?></th>
                                            <th><?php echo $achive." (". number_format(($achive/$target*100),2).") ";; ?></th>
                                            <th><?php echo $amt; ?></th>
                                            <th></th>

                                        </tr>
                                    </table>
                                </div>




                            </div>
                          </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="alert alert-success">
                                        <strong>Top 50 Products in Last 30 Days

                                        </strong>
                                    </div>

                                    <div id="topproduct" style="height: 370px; width: 100%;"></div>

                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="alert alert-success">
                                        <strong>Total Orders in Last 30 Days  :
                                            Avg Orders<?php echo " Last Year ( ". $yearAvg1." ) ". intval( $yearAvg1/30)." Current Year ( ". $yearAvg2." ) ". intval($yearAvg2/30)." <span style='background-color: yellow;color: green;font-size: 16pt;'> " .sprintf('%0.2f',(($yearAvg2/$yearAvg1)*100))." % </span>" ; ?>
                                        </strong>
                                    </div>
                                    <div id="chartContainerday" style="height: 370px; width: 100%;"></div>


                                </div>
                            </div>

                            <div class="row">
                            <div class="col-md-12">
                                <div class="alert alert-success">
                                    <strong>Total Orders in Last 30 Days  :
                                        Avg Orders<?php echo " Last Year ( ". $yearAvg1." ) ". intval( $yearAvg1/30)." Current Year ( ". $yearAvg2." ) ". intval($yearAvg2/30)." <span style='background-color: yellow;color: green;font-size: 16pt;'> " .sprintf('%0.2f',(($yearAvg2/$yearAvg1)*100))." % </span>" ; ?>
                                    </strong>
                                </div>
                                <div id="chartContainer" style="height: 370px; width: 100%;"></div>
                            </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="alert alert-success">
                                        <strong>USA Vs UK Last 30 Days  :
                                            Avg Orders<?php echo "USA ( ". $Avgcomp1." ) ". intval( $Avgcomp1/30)." UK ( ". $Avgcomp2." ) ". intval($Avgcomp2/30)." <span style='background-color: yellow;color: green;font-size: 16pt;'> " .sprintf('%0.2f',(($yearAvg2/$yearAvg1)*100))." % </span>" ; ?>
                                        </strong>
                                    </div>
                                    <div id="chartusa-uk" style="height: 370px; width: 100%;"></div>


                                </div>
                            </div>
                            <?php

                            if($groupid=="15")
                                {?>


                            <div class="row">
                                <div class="col-md-6">
                                    <div class="alert alert-success">
                                    <strong>Avg Orders<?php echo " Last Year ". intval( $AvgTW1/7)." Current Year ".intval( $AvgTW2/7)." <span style='background-color: yellow;color: green;font-size: 16pt;'> " .sprintf('%0.2f',(($AvgTW2/$AvgTW1)*100))." % </span>" ; ?>
                                        </strong>

                                    </div> </strong>

                                    <div id="barChartTW" style="height: 370px; width: 100%;"></div>

                                </div>
                                <div class="col-md-6">
                                    <div class="alert alert-success">
                                        <strong>Avg Orders
                                            <?php echo " Last Year ". intval( $AvgPMK1/7)." Current Year ".intval($AvgPMK2/7)." <span style='background-color: yellow;color: green;font-size: 16pt;'> " .sprintf('%0.2f',(($AvgPMK2/$AvgPMK1)*100))." % </span>" ; ?>

                                    </div> </strong>

                                    <div id="barChartPMK" style="height: 370px; width: 100%;"></div>

                                </div>
                                </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="alert alert-success">
                                        <strong>Avg Orders
                                            <?php echo " Last Year ". intval( $AvgWH1/7)." Current Year ".intval($AvgWH2/7)." <span style='background-color: yellow;color: green;font-size: 16pt;'> " .sprintf('%0.2f',(($AvgWH2/$AvgWH1)*100))." % </span>" ; ?>

                                    </div> </strong>
                                    <div id="barChartWH" style="height: 370px; width: 100%;"></div>

                                </div>
                                <div class="col-md-6">
                                    <div class="alert alert-success">
                                        <strong>Avg Orders
                                            <?php echo " Last Year ".intval( $AvgHND1/7)." Current Year ".intval($AvgHND2/7)." <span style='background-color: yellow;color: green;font-size: 16pt;'> " .sprintf('%0.2f',(($AvgHND2/$AvgHND1)*100))." % </span>" ; ?>

                                    </div> </strong>
                                    <div id="barChartHND" style="height: 370px; width: 100%;"></div>

                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="alert alert-success">
                                        <strong>Avg Orders
                                            <?php echo " Last Year ". intval( $AvgSNK1/7)." Current Year ".intval( $AvgSNK2/7)." <span style='background-color: yellow;color: green;font-size: 16pt;'> " .sprintf('%0.2f',(($AvgSNK2/$AvgSNK1)*100))." % </span>" ; ?>

                                    </div> </strong>
                                    <div id="barChartstar" style="height: 370px; width: 100%;"></div>

                                </div>
                                <div class="col-md-6">
                                    <div class="alert alert-success">
                                        <strong>Avg Orders
                                            <?php echo " Last Year ".intval(  $AvgBig1/7)." Current Year ".intval($AvgBig2/7)." <span style='background-color: yellow;color: green;font-size: 16pt;'> " .sprintf('%0.2f',(($AvgBig2/$AvgBig1)*100))." % </span>" ; ?>

                                    </div> </strong>
                                    <div id="barChartbig" style="height: 370px; width: 100%;"></div>

                                </div>
                            </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="alert alert-success">
                                                <strong>Avg Orders
                                                    <?php echo " Last Year ". intval( $AvgNYGT1/7)." Current Year ".intval( $AvgNYGT2/7)."
  <span style='background-color: yellow;color: green;font-size: 16pt;'> " .sprintf('%0.2f',(($AvgSNK2/$AvgNYGT1)*100))." % </span>" ; ?>

                                            </div> </strong>
                                            <div id="barChartnygt" style="height: 370px; width: 100%;"></div>

                                        </div>

                                    </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="alert alert-success">
                                        <strong>30 Days Company Wise Last Year

                                    </div> </strong>
                                    <div id="chartcompany1" style="height: 370px; width: 100%;"></div>

                                </div>
                                <div class="col-md-6">
                                    <div class="alert alert-success">
                                        <strong>30 Days Company Wise Current Year

                                    </div> </strong>
                                    <div id="chartcompany2" style="height: 370px; width: 100%;"></div>

                                </div>
                            </div>

                            <?php }?>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="alert alert-success">
                                        <strong>30 Days Country Wise Last Year

                                    </div> </strong>
                                    <div id="chartcountry1" style="height: 370px; width: 100%;"></div>

                                </div>
                                <div class="col-md-6">
                                    <div class="alert alert-success">
                                        <strong>30 Days Country Wise Current Year

                                    </div> </strong>
                                    <div id="chartcountry2" style="height: 370px; width: 100%;"></div>

                                </div>
                            </div>
                              
                           <!--  <div class="row">
                                <div class="col-md-12">
                                    <div class="alert alert-success">
                                        <strong>Top Product Last 30 Days
                                           
                                        </strong>
                                    </div>

                                    <div id="topproduct" style="height: 370px; width: 100%;"></div>

                                </div>
                          </div> -->
                    </div>
                    <!-- END EXAMPLE TABLE PORTLET-->
                </div>
            </div>

        </div>
    </div>
    <!-- END CONTENT -->





</div>
<script src="js/Chart.js"></script>
<!--<script src="js/Chart.min.js"></script>-->
<script src="js/jquery.js"></script>
<!--<script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>-->
<script src="js/canvasjs.min.js"></script>


<!---->
<script src="assets/global/plugins/jquery-1.11.0.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/jquery-migrate-1.2.1.min.js" type="text/javascript"></script>

<script>


        $(document).ready(function(){


            var chartusauk = new CanvasJS.Chart("chartusa-uk", {
                animationEnabled: true,
                theme: "light2",
                title:{
                    text: "USA vs UK"
                },
                legend:{
                    cursor: "pointer",
                    verticalAlign: "center",
                    horizontalAlign: "right",
                    itemclick: toggleDataSeries
                },
                data: [{
                    type: "column",
                    name: "USA",
                    click: onClickUK,
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($datacomp1, JSON_NUMERIC_CHECK); ?>
                },{
                    type: "column",
                    name: "UK",
                    click: onClickUK,
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($datacomp2, JSON_NUMERIC_CHECK); ?>
                }]
            });
            chartusauk.render();
            function onClickUK(e) {

                var url = 'country_wise_sale.php?date=' +e.dataPoint.label +'&country='+e.dataSeries.name;
                // document.location.href = url;
                window.open( url, '_blank' );


            }
            function toggleDataSeries(e){
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                }
                else{
                    e.dataSeries.visible = true;
                }
                chartusauk.render();
            }

            var chart = new CanvasJS.Chart("chartContainerday", {
                animationEnabled: true,
                title:{
                    text: "Daily order flow"
                },toolTip: {
                    shared: true
                },
                data: [
                    {
                        name: "Today",
                        type: "spline",
                        showInLegend: true,
                        dataPoints:<?php echo json_encode($lasttodayPoint, JSON_NUMERIC_CHECK); ?>

                    },
                    //{
                    //    name: "Last Month",
                    //    type: "spline",
                    //    showInLegend: true,
                    //    dataPoints:<?php //echo json_encode($lastmonthdayPoint, JSON_NUMERIC_CHECK); ?>
                    //
                    //},
                    {
                        name: "Yesterday",
                        type: "spline",
                        showInLegend: true,
                        dataPoints:<?php echo json_encode($lastdayPoint, JSON_NUMERIC_CHECK); ?>

                    },{
                        name: "Last Year",
                        type: "spline",
                        showInLegend: true,
                        dataPoints:<?php echo json_encode($lastyeardayPoint, JSON_NUMERIC_CHECK); ?>

                    }

                    ]
            });
            chart.render();


            // One week graph
            var barChartAll = new CanvasJS.Chart("barChartAll", {
                animationEnabled: true,
                theme: "light2",
                title:{
                    text: "Last 7 Days Orders"
                },
                legend:{
                    cursor: "pointer",
                    verticalAlign: "center",
                    horizontalAlign: "right",
                    itemclick: toggleDataSeries
                },
                data: [{
                    click: onsubmit,
                    type: "column",
                    name: "Last Year",
                     indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataPoints1week, JSON_NUMERIC_CHECK); ?>
                },{
                    click: onsubmit1,
                    type: "column",
                    name: "Current Year",
                     indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataPoints2week, JSON_NUMERIC_CHECK); ?>
                }]
            });
            barChartAll.render();
            function onsubmit(e) {
               var url = 'all_company_stock_history.php?&date=' +e.dataPoint.label;
                //  document.location.href = url;
                window.open( url, '_blank' );

                // window.open = (url, '_blank');

                //  alert( e.dataPoint + ", dataPoint { x:" + e.dataPoint + ", y: "+ e.dataPoint.y.indexLabel + " }" );
                }
                function onsubmit1(e) {
               var url = 'all_company_stock_history.php?&date=' +e.dataPoint.label;
                //  document.location.href = url;
                window.open( url, '_blank' );

                // window.open = (url, '_blank');

                //  alert( e.dataPoint + ", dataPoint { x:" + e.dataPoint + ", y: "+ e.dataPoint.y.indexLabel + " }" );
                }
//top product
             var topproduct = new CanvasJS.Chart("topproduct", {
                animationEnabled: true,
                 exportEnabled: true,
                 theme: "light2",
                title:{
                    text: "Top 50 Products in Last 30 Days"
                },
                legend:{
                    cursor: "pointer",
                    verticalAlign: "center",
                    horizontalAlign: "right"
                },
                data: [{
                    type: "column",

                    click: onClick,
                    // name: "Last 30 Days 30 Product",
                    indexLabel:"{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($top_product, JSON_NUMERIC_CHECK); ?>
                }]
            });
            topproduct.render();

            function onClick(e) {


                var url = 'top_selling_products.php?msku=' +e.dataPoint.label;
              //  document.location.href = url;
                window.open( url, '_blank' );

                // window.open = (url, '_blank');

                //  alert( e.dataPoint + ", dataPoint { x:" + e.dataPoint + ", y: "+ e.dataPoint.y.indexLabel + " }" );
            }

            function toggleDataSeries(e){
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                }
                else{
                    e.dataSeries.visible = true;
                }
                barChartAll.render();
            }

// One year graph
            var chartyear = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                theme: "light2",
                title:{
                    text: "Last 30 Days Orders"
                },
                legend:{
                    cursor: "pointer",
                    verticalAlign: "center",
                    horizontalAlign: "right",
                    itemclick: toggleDataSeries
                },
                data: [{
                    click: onsubmit2,
                    type: "column",
                    name: "Last Year",
                  //  indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataPoints1Year, JSON_NUMERIC_CHECK); ?>
                },{
                    click: onsubmit3,
                    type: "column",
                    name: "Current Year",
                  //  indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataPoints2Year, JSON_NUMERIC_CHECK); ?>
                }]
            });
            chartyear.render();
            function onsubmit2(e) {
               var url = 'all_company_stock_history.php?&date=' +e.dataPoint.label;
                //  document.location.href = url;
                window.open( url, '_blank' );

                // window.open = (url, '_blank');

                //  alert( e.dataPoint + ", dataPoint { x:" + e.dataPoint + ", y: "+ e.dataPoint.y.indexLabel + " }" );
                }
                function onsubmit3(e) {
               var url = 'all_company_stock_history.php?&date=' +e.dataPoint.label;
                //  document.location.href = url;
                window.open( url, '_blank' );

                // window.open = (url, '_blank');

                //  alert( e.dataPoint + ", dataPoint { x:" + e.dataPoint + ", y: "+ e.dataPoint.y.indexLabel + " }" );
                }
            function toggleDataSeries(e){
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                }
                else{
                    e.dataSeries.visible = true;
                }
                chartyear.render();
            }


            // TW week graph
            var barChartTW = new CanvasJS.Chart("barChartTW", {
                animationEnabled: true,
                theme: "light2",
                title:{
                    text: "Last 7 Days Orders TWC"
                },
                legend:{
                    cursor: "pointer",
                    verticalAlign: "center",
                    horizontalAlign: "right",
                    itemclick: toggleDataSeries
                },
                data: [{
                    click: onsubmit4,
                    type: "column",
                    name: "Last Year",
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataTW1, JSON_NUMERIC_CHECK); ?>
                },{
                    click: onsubmit4,
                    type: "column",
                    name: "Current Year",
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataTW2, JSON_NUMERIC_CHECK); ?>
                }]
            });
            barChartTW.render();
            function onsubmit4(e) {
               var url = 'all_company_stock_history.php?company=TWC&date=' +e.dataPoint.label;
                //  document.location.href = url;
                window.open( url, '_blank' );

                // window.open = (url, '_blank');

                //  alert( e.dataPoint + ", dataPoint { x:" + e.dataPoint + ", y: "+ e.dataPoint.y.indexLabel + " }" );
                }
            function toggleDataSeries(e){
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                }
                else{
                    e.dataSeries.visible = true;
                }
                barChartTW.render();
            }
            // TW week graph
            var barChartPMK = new CanvasJS.Chart("barChartPMK", {
                animationEnabled: true,
                theme: "light2",
                title:{
                    text: "Last 7 Days Orders PMK"
                },
                legend:{
                    cursor: "pointer",
                    verticalAlign: "center",
                    horizontalAlign: "right",
                    itemclick: toggleDataSeries
                },
                data: [{
                    click: onsubmit5,
                    type: "column",
                    name: "Last Year",
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataPMK1, JSON_NUMERIC_CHECK); ?>
                },{
                    click: onsubmit5,
                    type: "column",
                    name: "Current Year",
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataPMK2, JSON_NUMERIC_CHECK); ?>
                }]
            });
            barChartPMK.render();
            function onsubmit5(e) {
               var url = 'all_company_stock_history.php?company=PMK&date=' +e.dataPoint.label;
                //  document.location.href = url;
                window.open( url, '_blank' );

                // window.open = (url, '_blank');

                //  alert( e.dataPoint + ", dataPoint { x:" + e.dataPoint + ", y: "+ e.dataPoint.y.indexLabel + " }" );
                }
            function toggleDataSeries(e){
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                }
                else{
                    e.dataSeries.visible = true;
                }
                barChartPMK.render();
            }

            // TW week graph
            var barChartWH = new CanvasJS.Chart("barChartWH", {
                animationEnabled: true,
                theme: "light2",
                title:{
                    text: "Last 7 Days Orders WH - IN"
                },
                legend:{
                    cursor: "pointer",
                    verticalAlign: "center",
                    horizontalAlign: "right",
                    itemclick: toggleDataSeries
                },
                data: [{
                    click :onsubmit6,
                    type: "column",
                    name: "Last Year",
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataWH1, JSON_NUMERIC_CHECK); ?>
                },{
                    click :onsubmit6,
                    type: "column",
                    name: "Current Year",
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataWH2, JSON_NUMERIC_CHECK); ?>
                }]
            });
            barChartWH.render();
            function onsubmit6(e) {
               var url = 'all_company_stock_history.php?company=WH&date=' +e.dataPoint.label;
                //  document.location.href = url;
                window.open( url, '_blank' );

                // window.open = (url, '_blank');

                //  alert( e.dataPoint + ", dataPoint { x:" + e.dataPoint + ", y: "+ e.dataPoint.y.indexLabel + " }" );
                }   
            function toggleDataSeries(e){
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                }
                else{
                    e.dataSeries.visible = true;
                }
                barChartWH.render();
            }

            // HND week graph
            var barChartHND = new CanvasJS.Chart("barChartHND", {
                animationEnabled: true,
                theme: "light2",
                title:{
                    text: "Last 7 Days Orders WH HND"
                },
                legend:{
                    cursor: "pointer",
                    verticalAlign: "center",
                    horizontalAlign: "right",
                    itemclick: toggleDataSeries
                },
                data: [{
                    click:onsubmit7,
                    type: "column",
                    name: "Last Year",
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataHND1, JSON_NUMERIC_CHECK); ?>
                },{
                    click:onsubmit7,
                    type: "column",
                    name: "Current Year",
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataHND2, JSON_NUMERIC_CHECK); ?>
                }]
            });
            barChartHND.render();
            function onsubmit7(e) {
               var url = 'all_company_stock_history.php?company=HND&date=' +e.dataPoint.label;
                //  document.location.href = url;
                window.open( url, '_blank' );

                // window.open = (url, '_blank');

                //  alert( e.dataPoint + ", dataPoint { x:" + e.dataPoint + ", y: "+ e.dataPoint.y.indexLabel + " }" );
                }
            function toggleDataSeries(e){
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                }
                else{
                    e.dataSeries.visible = true;
                }
                barChartHND.render();
            }

            // STAR week graph
            var barChartstar = new CanvasJS.Chart("barChartstar", {
                animationEnabled: true,
                theme: "light2",
                title:{
                    text: "Last 7 Days Orders STAR"
                },
                legend:{
                    cursor: "pointer",
                    verticalAlign: "center",
                    horizontalAlign: "right",
                    itemclick: toggleDataSeries
                },
                data: [{
                    click:onsubmit8,
                    type: "column",
                    name: "Last Year",
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataSNK1, JSON_NUMERIC_CHECK); ?>
                },{
                    click:onsubmit8,
                    type: "column",
                    name: "Current Year",
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataSNK2, JSON_NUMERIC_CHECK); ?>
                }]
            });
            barChartstar.render();
            function onsubmit8(e) {
               var url = 'all_company_stock_history.php?company=STAR&date=' +e.dataPoint.label;
                //  document.location.href = url;
                window.open( url, '_blank' );

                // window.open = (url, '_blank');

                //  alert( e.dataPoint + ", dataPoint { x:" + e.dataPoint + ", y: "+ e.dataPoint.y.indexLabel + " }" );
                }
            var barChartnygt = new CanvasJS.Chart("barChartnygt", {
                animationEnabled: true,
                theme: "light2",
                title:{
                    text: "Last 7 Days Orders NYGT"
                },
                legend:{
                    cursor: "pointer",
                    verticalAlign: "center",
                    horizontalAlign: "right",
                    itemclick: toggleDataSeries
                },
                data: [{
                    click:onsubmit9,
                    type: "column",
                    name: "Last Year",
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataNYGT1, JSON_NUMERIC_CHECK); ?>
                },{
                    click:onsubmit9,
                    type: "column",
                    name: "Current Year",
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataNYGT2, JSON_NUMERIC_CHECK); ?>
                }]
            });
            barChartnygt.render();
            function onsubmit9(e) {
               var url = 'all_company_stock_history.php?company=NYGT&date=' +e.dataPoint.label;
                //  document.location.href = url;
                window.open( url, '_blank' );

                // window.open = (url, '_blank');

                //  alert( e.dataPoint + ", dataPoint { x:" + e.dataPoint + ", y: "+ e.dataPoint.y.indexLabel + " }" );
                }
            function toggleDataSeries(e){
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                }
                else{
                    e.dataSeries.visible = true;
                }
                barChartstar.render();
            }

            // Bignay week graph
            var barChartbig = new CanvasJS.Chart("barChartbig", {
                animationEnabled: true,
                theme: "light2",
                title:{
                    text: "Last 7 Days Orders BIGNAY"
                },
                legend:{
                    cursor: "pointer",
                    verticalAlign: "center",
                    horizontalAlign: "right",
                    itemclick: toggleDataSeries
                },
                data: [{
                    click:onsubmit10,
                    type: "column",
                    name: "Last Year",
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataBig1, JSON_NUMERIC_CHECK); ?>
                },{
                    click:onsubmit10,
                    type: "column",
                    name: "Current Year",
                    indexLabel: "{y}",
                    yValueFormatString: "#0.##",
                    showInLegend: true,
                    dataPoints: <?php echo json_encode($dataBig2, JSON_NUMERIC_CHECK); ?>
                }]
            });
            barChartbig.render();
            function onsubmit10(e) {
               var url = 'all_company_stock_history.php?company=BIG&date=' +e.dataPoint.label;
                //  document.location.href = url;
                window.open( url, '_blank' );

                // window.open = (url, '_blank');

                //  alert( e.dataPoint + ", dataPoint { x:" + e.dataPoint + ", y: "+ e.dataPoint.y.indexLabel + " }" );
                }
            function toggleDataSeries(e){

                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                }
                else{
                    e.dataSeries.visible = true;
                }
                barChartbig.render();
            }
        });


        var chartcompany1 = new CanvasJS.Chart("chartcompany1", {
            animationEnabled: true,
            // exportEnabled: true,
            title:{
                text: "30 Day - Last year - Company Wise"
            },

            data: [{
                type: "pie",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 14,
                indexLabel: "{label} - #percent%",
                yValueFormatString: "#,##0",
                dataPoints: <?php echo json_encode($datacompany1, JSON_NUMERIC_CHECK); ?>
            }]
        });
        chartcompany1.render();


        var chartcompany2 = new CanvasJS.Chart("chartcompany2", {
            animationEnabled: true,
            // exportEnabled: true,
            title:{
                text: "30 Day - This Year - Company Wise"
            },

            data: [{
                type: "pie",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 14,
                indexLabel: "{label} - #percent%",
                yValueFormatString: "#,##0",
                dataPoints: <?php echo json_encode($datacompany2, JSON_NUMERIC_CHECK); ?>
            }]
        });
        chartcompany2.render();



        var chartcountry1 = new CanvasJS.Chart("chartcountry1", {
            animationEnabled: true,
            // exportEnabled: true,
            title:{
                text: "30 Day - Last Year - Country Wise"
            },

            data: [{
                type: "pie",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - #percent%",
                yValueFormatString: "#,##0",
                dataPoints: <?php echo json_encode($datacountry1, JSON_NUMERIC_CHECK); ?>
            }]
        });
        chartcountry1.render();


        var chartcountry2 = new CanvasJS.Chart("chartcountry2", {
            animationEnabled: true,
            // exportEnabled: true,
            title:{
                text: "30 Day - This Year - Country Wise"
            },

            data: [{
                type: "pie",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - #percent%",
                yValueFormatString: "#,##0",
                dataPoints: <?php echo json_encode($datacountry2, JSON_NUMERIC_CHECK); ?>
            }]
        });
        chartcountry2.render();



        function drawGraph(Labels, Data,graph){
            var ctxB = document.getElementById(graph).getContext('2d');
        //    label: 'No Of Daily Orders - '+cnt+' Days Avg : '+order,
            var myBarChart = new Chart(ctxB, {
                type: 'bar',
                data: {
                    labels: Labels,
                    datasets: [{
                        label: 'No Of Daily Orders ',
                        data: Data,
                        backgroundColor:'#0318CF',

                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });
        }

</script>
<script type="text/css">

    /* Tooltip container */
    .tooltip1 {
        position: relative;
        display: inline-block;
        border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
    }

    /* Tooltip text */
    .tooltip1 .tooltiptext {
        visibility: hidden;
        width: 120px;
        background-color: #555;
        color: #fff;
        text-align: center;
        padding: 5px 0;
        border-radius: 6px;

        /* Position the tooltip text */
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        margin-left: -60px;

        /* Fade in tooltip */
        opacity: 0;
        transition: opacity 1s;
    }

    /* Tooltip arrow */
    .tooltip1 .tooltiptext::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
    }

    /* Show the tooltip text when you mouse over the tooltip container */
    .tooltip1:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
    }
</script>
<?php
include('footer.php');
?>

<script type="text/javascript" src="assets/global/plugins/select2/select2.min.js"></script>
<script type="text/javascript" src="assets/global/plugins/datatables/media/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js"></script>

<script src="assets/global/scripts/metronic.js" type="text/javascript"></script>
<script src="assets/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="assets/admin/layout/scripts/quick-sidebar.js" type="text/javascript"></script>
<script src="assets/admin/layout/scripts/demo.js" type="text/javascript"></script>
<script src="assets/admin/pages/scripts/table-editable.js"></script>