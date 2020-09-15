<?php
ini_set('max_execution_time',300);
require_once('access.php');
include('header.php');
header("Access-Control-Allow-Origin: https://bo.beldara.com");
//header("Access-Control-Allow-Origin: https://192.168.1.250/");

session_start();
$userid=$_SESSION['userid'];
$ip=$_SERVER['REMOTE_ADDR'];
if($_GET['languageid']!=='') {
    $languageid=$_GET['languageid'];
    $code=$_GET['code'];
    $pageid= $_GET['pageid'];
    $url= $_GET['url'];

}
else{
    $code= $_POST['code'];
    $pageid= $_POST['pageid'];
    $languageid= $_POST['languageid'];
    $url= $_POST['url'];

}
if($_POST['btnSave']=="save") {

    $title = addslashes($_POST['title']);
    $content = addslashes($_POST['content']);
    $head =addslashes( $_POST['head']);
    $keyword = addslashes($_POST['keyword']);
    $desc = addslashes($_POST['desc1']);
    $head = addslashes($_POST['head']);
    $pageid= $_POST['pageid'];
    $languageid= $_POST['languageid'];
    $res = $obj->delete("tbl_static_content","languageid='$languageid' and pageid='$pageid'");

    $res = $obj->insert("tbl_static_content", "head,keyword,desc1,title,content,pageid,languageid,sysdate,ip,userid,code",
        "'$head','$keyword','$desc','$title','$content','$pageid','$languageid', NOW(),'$ip','$userid','$code'");



    $array = Array();

        $res=$obj->select_data("title,meta_desc,keyword,content,code","view_static_content","pageid='$pageid' and languageid='$languageid'")[0];
       if(sizeof($res)>0) {
           $mainarra = array("locale" => $code, "messages" => array($res));

       }

    $filename=$url."_".$code.".json";
// encode array to json
    $json = json_encode( $mainarra);
// write json to file
    if (file_put_contents("/var/www/beldara.com/public_html/api/json/".$filename, $json))
        echo "File JSON sukses dibuat...";
    else
        echo "Oops! Terjadi error saat membuat file JSON...";

    exit;

    $host="165.22.216.247";
    $port=21;
    $timeout="20";
    $user="bbftp";
    $pass="Beldara2323#";
    $source_file = '../api/json/'.$filename;
    $dest_file = 'theme/src/api/' . $filename;

    $ftp = ftp_connect($host,$port,$timeout);
    ftp_login($ftp,$user,$pass);

    $ret = ftp_nb_put($ftp, $dest_file, $source_file, FTP_BINARY, FTP_AUTORESUME);
    while (FTP_MOREDATA == $ret)
    {
        $ret = ftp_nb_continue($ftp);
    }

}

$res=$obj->select_data("*","tbl_static_content","languageid='$languageid' and pageid='$pageid'")[0];


?>
<div class="clearfix">
</div>
<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/css/select2.min.css" rel="stylesheet" />

<!-- BEGIN CONTAINER -->
<div class="page-container">
    <!-- BEGIN SIDEBAR -->
    <?php require_once('sidebar.php'); ?>
    <div class="page-content-wrapper">
        <div class="page-content">
            <div class="row">
                <div class="col-md-12">
                    <!-- BEGIN EXAMPLE TABLE PORTLET-->
                    <div class="portlet box blue">
                        <div class="portlet-title">
                            <div class="caption">
                                <i class="fa fa-edit"></i>Static Page Content for  <?php echo $_GET['page']." - ".$_GET['lang'];?>
                            </div>
                        </div>
                        <div class="portlet-body">
                            <form method="post" action="" enctype="multipart/form-data">
                                <input type="hidden"  id="languageid" name="languageid" value="<?php echo $languageid;?>">
                                <input type="hidden"  id="pageid" name="pageid" value="<?php echo $pageid;?>">
                                <input type="hidden"  id="code" name="code" value="<?php echo $code;?>">

                                <div class="form-group row">
                                    <label for="title" class="col-sm-2 col-form-label">Meta Title</label>
                                    <div class="col-sm-10">
                                        <input type="text" style="width: 700px;"
                                               value="<?php echo $res['title']; ?>"
                                               class="form-control" sty id="title" name="title" placeholder="Meta Title" required>

                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="title" class="col-sm-2 col-form-label">Meta Keyword</label>
                                    <div class="col-sm-10">
                                        <input type="text" style="width: 700px;"
                                               value="<?php echo $res['keyword']; ?>"
                                               class="form-control" sty id="keyword" name="keyword" placeholder="Meta Keyword" required>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="title" class="col-sm-2 col-form-label">Meta Description</label>
                                    <div class="col-sm-10">
                                        <input type="text" style="width: 700px;"                                                 value="<?php echo $res['title']; ?>"
                                               value="<?php echo $res['desc1']; ?>"
                                               class="form-control" sty id="desc1" name="desc1" placeholder="Meta Description" required>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="title" class="col-sm-2 col-form-label">Heading</label>
                                    <div class="col-sm-6">
                                        <input type="text" style="width: 400px;"
                                               value="<?php echo $res['head']; ?>"
                                               class="form-control" sty id="head" name="head" placeholder="Page Heading" required>
                                    </div>
                                    <div class="col-sm-3">
                                        <button id="btnSave" value="save"  name="btnSave" type="submit" class="btn green" formnovalidate>
                                            Submit <i class="fa fa-plus"></i>
                                        </button>
                                    </div>

                                </div>

                                <div class="form-group row">
                                    <label for="description" class="col-sm-2 col-form-label">Description</label>
                                    <div class="col-sm-8">
                                        <!--                                        <input type="text" class="form-control" id="description" name="description" placeholder="Description">-->
                                        <textarea id="elm1" name="content" required> <?php echo $res['content']; ?></textarea>
                                    </div>
                                </div>


                            </form>
                            <!-- </form> -->
                        </div>
                    </div>
                </div>
                <!-- END EXAMPLE TABLE PORTLET-->
            </div>
        </div>
        <!-- END CONTENT -->
        <!-- Modal for assign lead -->
        <script type="text/javascript" src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
        <!--        <script src="assets/tinymce/tinymce.min.js"></script>-->
        <?php

        include('footer.php');
        ?>
        <script type="text/javascript">
            $(document).ready(function(){

                if($("#elm1").length > 0){
                    tinymce.init({
                        selector: "textarea#elm1",
                        theme: "modern",
                        height:300,
                        width:800,
                        plugins: [
                            "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
                            "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                            "save table contextmenu directionality emoticons template paste textcolor"
                        ],
                        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | l      ink image | print preview media fullpage | forecolor backcolor emoticons",
                        style_formats: [
                            {title: 'Bold text', inline: 'b'},
                            {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
                            {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
                            {title: 'Example 1', inline: 'span', classes: 'example1'},
                            {title: 'Example 2', inline: 'span', classes: 'example2'},
                            {title: 'Table styles'},
                            {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
                        ]
                    });
                }
                //
                //
                // $('li .paginate_button').click(function(){ console.log(1); });
                //
                //
                // $('#select_all').on('click',function(){
                //     if(this.checked){
                //         $('.sendTo').each(function(){
                //             this.checked = true;
                //             $(this).parent().removeClass('checked').addClass('checked');
                //         });
                //     }else{
                //         $('.sendTo').each(function(){
                //             this.checked = false;
                //             $(this).parent().removeClass('checked');
                //         });
                //     }
                // });
                //
                // $('input[type="checkbox"]:not(#select_all)').click(function(){
                //
                //     if($('.checker').length == $('.checked').length || $('.checker:not(#select_all)').length == $('.checked').length){
                //         $('#select_all').prop('checked',true);
                //         $('#select_all').parent().removeClass('checked').addClass('checked');
                //     }else{
                //         $('#select_all').prop('checked',false);
                //         $('#select_all').parent().removeClass('checked');
                //     }
                //     console.log('clicked');
                //     console.log($('.checker').length);
                //     console.log($('.checked').length);
                // });
            });
        </script>
        <script type="text/javascript" src="assets/global/plugins/select2/select2.min.js"></script>
        <script type="text/javascript" src="assets/global/plugins/datatables/media/js/jquery.dataTables.min.js"></script>
        <script type="text/javascript" src="assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js"></script>

        <script src="assets/global/scripts/metronic.js" type="text/javascript"></script>
        <script src="assets/admin/layout/scripts/layout.js" type="text/javascript"></script>
        <script src="assets/admin/layout/scripts/quick-sidebar.js" type="text/javascript"></script>
        <script src="assets/admin/layout/scripts/demo.js" type="text/javascript"></script>
        <script src="assets/admin/pages/scripts/table-editable.js"></script>

        <script type="text/javascript">
        </script>
